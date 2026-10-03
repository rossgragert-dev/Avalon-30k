import { describe, expect, it } from 'vitest';
import {
  CAMPAIGN_SAVE_KEY,
  clearCampaignSave,
  readCampaignSave,
  writeCampaignSave,
} from '../src/game/campaign_save';
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
} as unknown as CharacterState;

describe('campaign save slot', () => {
  it('round-trips class, temporary identity, state, and appearance', () => {
    const storage = memoryStorage();
    expect(
      writeCampaignSave(storage, 'mage', 'Wanderer', STATE, { hair: 'silver' }, 1234),
    ).toBe(true);
    expect(readCampaignSave(storage)).toEqual({
      version: 1,
      savedAt: 1234,
      playerClass: 'mage',
      name: 'Wanderer',
      state: STATE,
      appearance: { hair: 'silver' },
    });
  });

  it('rejects corrupt or unknown-class saves and can be cleared', () => {
    const storage = memoryStorage();
    storage.setItem(
      CAMPAIGN_SAVE_KEY,
      JSON.stringify({
        version: 1,
        savedAt: 1,
        playerClass: 'dragon-knight',
        name: 'Wanderer',
        state: STATE,
      }),
    );
    expect(readCampaignSave(storage)).toBeNull();

    storage.setItem(CAMPAIGN_SAVE_KEY, '{nope');
    expect(readCampaignSave(storage)).toBeNull();
    expect(clearCampaignSave(storage)).toBe(true);
    expect(storage.getItem(CAMPAIGN_SAVE_KEY)).toBeNull();
  });
});
