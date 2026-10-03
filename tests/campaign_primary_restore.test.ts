import { describe, expect, it } from 'vitest';
import { Sim } from '../src/sim/sim';

describe('single-player primary-character restore seam', () => {
  it('restores a serialized class character instead of treating Continue as a fresh start', () => {
    const first = new Sim({
      seed: 42,
      playerClass: 'mage',
      playerName: 'Wanderer',
      compulsoryTutorial: false,
    });
    first.setPlayerLevel(4, first.playerId);
    const original = first.entities.get(first.playerId)!;
    original.pos.x = 37;
    original.pos.z = -22;
    original.prevPos = { ...original.pos };
    first.rebucket(original);

    const state = first.serializeCharacter(first.playerId);
    expect(state).not.toBeNull();

    const restored = new Sim({
      seed: 42,
      playerClass: 'mage',
      playerName: 'Wanderer',
      playerState: state!,
      compulsoryTutorial: true,
    });

    const player = restored.entities.get(restored.playerId)!;
    expect(player.level).toBe(4);
    expect(player.pos.x).toBe(37);
    expect(player.pos.z).toBe(-22);
    expect(restored.meta(restored.playerId).cls).toBe('mage');
  });
});
