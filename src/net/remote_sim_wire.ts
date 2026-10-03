import type { Entity, PlayerClass } from '../sim/types';
import { ALL_CLASSES } from '../sim/types';

export const REMOTE_SIM_TOKEN_PREFIX = 'nameless-road-remote:';
export const REMOTE_SIM_INTEREST_RADIUS = 125;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function remoteTokenForClass(cls: PlayerClass): string {
  return `${REMOTE_SIM_TOKEN_PREFIX}${cls}`;
}

export function playerClassFromRemoteToken(token: unknown): PlayerClass | null {
  if (typeof token !== 'string' || !token.startsWith(REMOTE_SIM_TOKEN_PREFIX)) return null;
  const value = token.slice(REMOTE_SIM_TOKEN_PREFIX.length);
  return ALL_CLASSES.includes(value as PlayerClass) ? (value as PlayerClass) : null;
}

/**
 * A deliberately small subset of the existing ClientWorld entity wire.
 *
 * The remote-simulation experiment always sends full records. We do not need
 * the MMO server's identity/dynamic delta caches to answer the A/B question.
 */
export function remoteEntityWire(e: Entity): Record<string, unknown> {
  const out: Record<string, unknown> = {
    id: e.id,
    k: e.kind,
    tid: e.templateId,
    nm: e.name,
    lv: e.level,
    x: round2(e.pos.x),
    y: round2(e.pos.y),
    z: round2(e.pos.z),
    f: round2(e.facing),
    hp: e.hp,
    mhp: e.maxHp,
  };

  if (e.skin) out.sk = e.skin;
  if (e.skinCatalog === 'mech') out.cat = 'mech';
  if (e.mainhandItemId) out.mh = e.mainhandItemId;
  if (e.offhandItemId) out.oh = e.offhandItemId;
  if (e.weaponSkinId) out.wsk = e.weaponSkinId;
  if (e.mountKey) out.mnt = e.mountKey;
  if (e.mountSkinId) out.msk = e.mountSkinId;
  if (e.modularAppearance) out.app = e.modularAppearance;
  if (e.scale !== 1) out.sc = e.scale;
  if (e.color !== 0xffffff) out.c = e.color;
  if (e.objectItemId) out.obj = e.objectItemId;
  if (e.dungeonId) out.dgn = e.dungeonId;

  if (e.dead) out.dead = 1;
  if (e.ghost) out.gh = 1;
  if (e.lootable) out.loot = 1;
  if (e.hostile) out.h = 1;
  if (e.sitting || e.eating || e.drinking) out.sit = 1;
  if (e.weaponStowed) out.ws = 1;
  if (e.helmHidden) out.hh = 1;

  if (e.resourceType) {
    out.rtype = e.resourceType;
    out.res = Math.round(e.resource);
    out.mres = e.maxResource;
  }
  if (e.castingAbility) {
    out.cast = e.castingAbility;
    out.castRem = round2(e.castRemaining);
    out.castTot = round2(e.castTotal);
    if (e.castTargetId !== null) out.castTgt = e.castTargetId;
    if (e.channeling) out.chan = 1;
  }
  if (e.autoAttack) out.swing = round2(e.swingTimer);
  if (e.targetId !== null) out.tgt = e.targetId;
  if (e.aggroTargetId !== null) out.aggro = e.aggroTargetId;
  if (e.forcedTargetId !== null) out.ft = e.forcedTargetId;
  if (e.ownerId !== null) out.own = e.ownerId;
  if (e.rangedPower) out.rp = e.rangedPower;

  if (e.kind === 'mob' && e.lootable && e.loot) {
    out.lootList = { copper: e.loot.copper, items: e.loot.items };
  }

  return out;
}

export function remoteSelfWire(e: Entity, inputAck: number): Record<string, unknown> {
  const cooldowns: Record<string, number> = {};
  for (const [id, remaining] of e.cooldowns) {
    if (remaining > 0) cooldowns[id] = round2(remaining);
  }

  const charges: Record<string, number> = {};
  if (e.abilityCharges) {
    for (const id in e.abilityCharges) {
      const state = e.abilityCharges[id];
      if (state) charges[id] = state.charges;
    }
  }

  return {
    ...remoteEntityWire(e),
    res: round2(e.resource),
    mres: e.maxResource,
    rtype: e.resourceType,
    gcd: round2(e.gcdRemaining),
    pcd: round2(e.potionCdRemaining),
    fcd: round2(e.firebottleCdRemaining),
    swing: round2(e.swingTimer),
    swingOff: round2(e.offhandSwingTimer),
    combo: e.comboPoints,
    target: e.targetId,
    auto: e.autoAttack,
    ack: inputAck,
    cds: cooldowns,
    achg: charges,
  };
}

export function withinRemoteInterest(player: Entity, entity: Entity): boolean {
  if (player.id === entity.id) return false;
  const dx = entity.pos.x - player.pos.x;
  const dz = entity.pos.z - player.pos.z;
  return dx * dx + dz * dz <= REMOTE_SIM_INTEREST_RADIUS * REMOTE_SIM_INTEREST_RADIUS;
}
