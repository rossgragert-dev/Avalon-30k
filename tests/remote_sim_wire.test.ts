import { describe, expect, it } from 'vitest';
import {
  REMOTE_SIM_INTEREST_RADIUS,
  playerClassFromRemoteToken,
  remoteEntityWire,
  remoteSelfWire,
  remoteTokenForClass,
  withinRemoteInterest,
} from '../src/net/remote_sim_wire';
import { Sim } from '../src/sim/sim';
import { ALL_CLASSES } from '../src/sim/types';

describe('remote simulation wire', () => {
  it('round-trips every playable class through the experiment token', () => {
    for (const cls of ALL_CLASSES) {
      expect(playerClassFromRemoteToken(remoteTokenForClass(cls))).toBe(cls);
    }
    expect(playerClassFromRemoteToken('nameless-road-remote:not-a-class')).toBeNull();
    expect(playerClassFromRemoteToken('anything-else')).toBeNull();
  });

  it('encodes a fresh player without requiring optional charge state', () => {
    const sim = new Sim({
      seed: 42,
      playerClass: 'mage',
      playerName: 'Wanderer',
      compulsoryTutorial: false,
    });
    const wire = remoteSelfWire(sim.player, 17);
    expect(wire.k).toBe('player');
    expect(wire.tid).toBe('mage');
    expect(wire.nm).toBe('Wanderer');
    expect(wire.ack).toBe(17);
    expect(wire.x).toBeTypeOf('number');
    expect(wire.cds).toEqual({});
    expect(wire.achg).toEqual({});
  });

  it('uses a bounded nearby-interest set for the phone mirror', () => {
    const sim = new Sim({
      seed: 7,
      playerClass: 'warrior',
      playerName: 'Wanderer',
      compulsoryTutorial: false,
    });
    const player = sim.player;
    const peer = [...sim.entities.values()].find((e) => e.id !== player.id);
    expect(peer).toBeDefined();
    if (!peer) return;

    peer.pos.x = player.pos.x + REMOTE_SIM_INTEREST_RADIUS - 1;
    peer.pos.z = player.pos.z;
    expect(withinRemoteInterest(player, peer)).toBe(true);

    peer.pos.x = player.pos.x + REMOTE_SIM_INTEREST_RADIUS + 1;
    expect(withinRemoteInterest(player, peer)).toBe(false);

    const wire = remoteEntityWire(peer);
    expect(wire.id).toBe(peer.id);
    expect(wire.k).toBe(peer.kind);
  });
});
