import { createServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { CAMPAIGN_PROTAGONIST_NAME } from '../src/game/campaign_identity';
import {
  playerClassFromRemoteToken,
  remoteEntityWire,
  remoteSelfWire,
  withinRemoteInterest,
} from '../src/net/remote_sim_wire';
import { normalizeMoveFacing, sanitizeMoveInput } from '../src/sim/move_input';
import { Sim } from '../src/sim/sim';
import { WORLD_SEED } from '../src/sim/world_seed';

const PORT = Number(process.env.PORT ?? 8788);
const MAX_SESSIONS = Math.max(1, Number(process.env.MAX_REMOTE_SESSIONS ?? 4));
const SNAPSHOT_EVERY_TICKS = 2; // 10 Hz snapshots; Sim remains authoritative at 20 Hz.
const MAX_MESSAGE_BYTES = 32 * 1024;
const SESSION_TTL_MS = 45 * 60 * 1000;

interface RemoteSession {
  ws: WebSocket;
  sim: Sim;
  lastInputSeq: number;
  ticks: number;
  interval: NodeJS.Timeout;
  expires: NodeJS.Timeout;
}

const sessions = new Set<RemoteSession>();

function send(ws: WebSocket, value: unknown): void {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(value));
}

function safeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function commandOutcome(session: RemoteSession, msg: Record<string, unknown>, ok: boolean): void {
  if (Number.isSafeInteger(msg.rid) && Number(msg.rid) > 0) {
    send(session.ws, { t: 'commandOutcome', rid: Number(msg.rid), ok });
  }
}

function dispatchCommand(session: RemoteSession, msg: Record<string, unknown>): void {
  const sim = session.sim;
  const cmd = typeof msg.cmd === 'string' ? msg.cmd : '';

  if (Number.isSafeInteger(msg.seq) && Number(msg.seq) > 0) {
    session.lastInputSeq = Math.max(session.lastInputSeq, Number(msg.seq));
  }

  switch (cmd) {
    case 'target':
      sim.targetEntity(typeof msg.id === 'number' ? msg.id : null);
      return;
    case 'tab':
      sim.tabTarget();
      return;
    case 'tabPrev':
      sim.tabTargetPrev();
      return;
    case 'targetNearestFriendly':
      sim.targetNearestFriendly();
      return;
    case 'tabFriendly':
      sim.friendlyTabTarget();
      return;
    case 'stopAutoAttackOnTargetSwitch':
      sim.setStopAutoAttackOnTargetSwitch(msg.enabled === true);
      return;
    case 'cast':
      if (typeof msg.ability === 'string') {
        if (typeof msg.target === 'number') sim.castAbilityOn(msg.ability, msg.target);
        else sim.castAbility(msg.ability);
      }
      return;
    case 'castSlot':
      if (Number.isSafeInteger(msg.slot)) sim.castAbilityBySlot(Number(msg.slot));
      return;
    case 'castAt': {
      const x = safeNumber(msg.x);
      const z = safeNumber(msg.z);
      if (typeof msg.ability === 'string' && x !== null && z !== null) {
        sim.castAbilityAt(msg.ability, { x, z });
      }
      return;
    }
    case 'releaseEmpowered':
      if (typeof msg.ability === 'string') sim.releaseEmpoweredAbility(msg.ability);
      return;
    case 'cancel_aura':
      if (typeof msg.aura === 'string') sim.cancelAura(msg.aura);
      return;
    case 'attack':
      sim.startAutoAttack();
      return;
    case 'stopattack':
      sim.stopAutoAttack();
      return;
    case 'release':
      sim.releaseSpirit();
      return;
    case 'resurrect_corpse':
      sim.resurrectAtCorpse();
      return;
    case 'resurrect_healer': {
      const ok = Boolean(sim.resurrectAtSpiritHealer());
      commandOutcome(session, msg, ok);
      return;
    }
    case 'interact':
      sim.interact();
      return;
    case 'loot': {
      const ok = typeof msg.id === 'number' && sim.lootCorpse(msg.id);
      commandOutcome(session, msg, ok);
      return;
    }
    case 'autoloot':
      if (typeof msg.id === 'number') sim.autoLoot(msg.id);
      return;
    case 'pickup': {
      const ok = typeof msg.id === 'number' && sim.pickUpObject(msg.id);
      commandOutcome(session, msg, ok);
      return;
    }
    case 'unstuck':
      sim.unstuck();
      return;
    default:
      // The performance experiment intentionally leaves MMO/social/economy
      // commands inert. Resolve any correlated request instead of stranding UI.
      commandOutcome(session, msg, false);
  }
}

function applyInput(session: RemoteSession, msg: Record<string, unknown>): void {
  Object.assign(session.sim.moveInput, sanitizeMoveInput(msg.mi));
  const facing = normalizeMoveFacing(msg.facing);
  if (facing !== null) session.sim.player.facing = facing;
  if (Number.isSafeInteger(msg.seq) && Number(msg.seq) > 0) {
    session.lastInputSeq = Math.max(session.lastInputSeq, Number(msg.seq));
  }
}

function sendSnapshot(session: RemoteSession): void {
  const player = session.sim.player;
  const ents: Record<string, unknown>[] = [];
  for (const entity of session.sim.entities.values()) {
    if (withinRemoteInterest(player, entity)) ents.push(remoteEntityWire(entity));
  }
  send(session.ws, {
    t: 'snap',
    time: session.sim.time,
    tickHz: 20,
    ents,
    keep: [],
    self: remoteSelfWire(player, session.lastInputSeq),
  });
}

function startSession(ws: WebSocket, cls: NonNullable<ReturnType<typeof playerClassFromRemoteToken>>): RemoteSession {
  const sim = new Sim({
    seed: WORLD_SEED,
    playerClass: cls,
    playerName: CAMPAIGN_PROTAGONIST_NAME,
    compulsoryTutorial: false,
    devCommands: false,
    // A private single-player server can be more aggressive than the MMO realm:
    // far-away idle mobs do not need to burn CPU for another human viewer.
    idleMobTickRadius: 110,
  });

  const session = {} as RemoteSession;
  session.ws = ws;
  session.sim = sim;
  session.lastInputSeq = 0;
  session.ticks = 0;
  session.interval = setInterval(() => {
    const events = sim.tick();
    if (events.length > 0) send(ws, { t: 'events', list: events });
    session.ticks++;
    if (session.ticks % SNAPSHOT_EVERY_TICKS === 0) sendSnapshot(session);
  }, 50);
  session.expires = setTimeout(() => {
    send(ws, { t: 'error', error: 'Remote test session expired. Reopen the game to continue testing.' });
    ws.close(1000, 'session ttl');
  }, SESSION_TTL_MS);
  sessions.add(session);
  return session;
}

function stopSession(session: RemoteSession | null): void {
  if (!session) return;
  clearInterval(session.interval);
  clearTimeout(session.expires);
  sessions.delete(session);
}

const http = createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    });
    res.end(JSON.stringify({ ok: true, sessions: sessions.size, mode: 'remote-sim-experiment' }));
    return;
  }
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('The Nameless Road remote simulation experiment');
});

const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE_BYTES });

http.on('upgrade', (req, socket, head) => {
  if (req.url !== '/ws') {
    socket.destroy();
    return;
  }
  if (sessions.size >= MAX_SESSIONS) {
    socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n');
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
});

wss.on('connection', (ws) => {
  let session: RemoteSession | null = null;
  const authTimer = setTimeout(() => ws.close(1008, 'auth timeout'), 5000);

  ws.on('message', (raw) => {
    if (raw.byteLength > MAX_MESSAGE_BYTES) {
      ws.close(1009, 'message too large');
      return;
    }

    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw.toString()) as Record<string, unknown>;
    } catch {
      return;
    }

    if (!session) {
      const cls = playerClassFromRemoteToken(msg.token);
      if (!cls) {
        send(ws, { t: 'error', error: 'Remote simulation test authentication failed.' });
        ws.close(1008, 'bad remote token');
        return;
      }
      clearTimeout(authTimer);
      session = startSession(ws, cls);
      send(ws, {
        t: 'hello',
        pid: session.sim.playerId,
        seed: WORLD_SEED,
        realm: 'Nameless Road Remote Test',
        movementWire: 2,
      });
      sendSnapshot(session);
      return;
    }

    if (msg.t === 'input') {
      applyInput(session, msg);
      return;
    }
    if (msg.t === 'cmd') {
      if (msg.cmd === 'logout') {
        ws.close(1000, 'logout');
        return;
      }
      dispatchCommand(session, msg);
      return;
    }
    if (msg.t === 'logout') ws.close(1000, 'logout');
  });

  ws.on('close', () => {
    clearTimeout(authTimer);
    stopSession(session);
    session = null;
  });
  ws.on('error', () => {
    stopSession(session);
    session = null;
  });
});

http.listen(PORT, '0.0.0.0', () => {
  console.log(`[remote-sim] listening on :${PORT}; max sessions=${MAX_SESSIONS}`);
});
