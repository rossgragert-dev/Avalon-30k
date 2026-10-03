import { describe, expect, it } from 'vitest';
import {
  AVALON_SAVE_KEY,
  clearAvalonSave,
  readAvalonSave,
  writeAvalonSave,
} from '../src/game/avalon_save';
import type { CharacterState } from '../src/sim/character_state';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
    removeItem(key: string) {
      data.delete(key);
    },
  };
}

const STATE = {
  level: 3,
  xp: 45,
  copper: 120,
  hp: 80,
  resource: 15,
  pos: { x: 10, z: 20 },
  facing: 1,
  dead: false,
  ghost: false,
  corpsePos: null,
  equipment: {},
  equipmentInstance: {},
  inventory: [],
  bank: [],
  vendorBuyback: [],
  questLog: [],
  questsDone: [],
  arenaRating: 0,
  arenaWins: 0,
  arenaLosses: 0,
  arena2v2Rating: 0,
  arena2v2Wins: 0,
  arena2v2Losses: 0,
} as unknown as CharacterState;

describe('Avalon save slot', () => {
  it('round-trips the inherited CharacterState and optional appearance', () => {
    const storage = memoryStorage();
    expect(writeAvalonSave(storage, STATE, { hair: 'silver' }, 1234)).toBe(true);
    expect(readAvalonSave(storage)).toEqual({
      version: 1,
      savedAt: 1234,
      state: STATE,
      appearance: { hair: 'silver' },
    });
  });

  it('fails closed on corrupt data and can be cleared', () => {
    const storage = memoryStorage();
    storage.setItem(AVALON_SAVE_KEY, '{nope');
    expect(readAvalonSave(storage)).toBeNull();
    expect(clearAvalonSave(storage)).toBe(true);
    expect(storage.getItem(AVALON_SAVE_KEY)).toBeNull();
  });
});
