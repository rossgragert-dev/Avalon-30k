import type { CharacterState } from '../sim/character_state';
import { ALL_CLASSES, type PlayerClass } from '../sim/types';

export const CAMPAIGN_SAVE_KEY = 'nameless-road.save.v1';

export interface CampaignSaveEnvelope {
  version: 1;
  savedAt: number;
  playerClass: PlayerClass;
  name: string;
  state: CharacterState;
  appearance?: Record<string, unknown> | null;
}

type ReadStorage = Pick<Storage, 'getItem'>;
type WriteStorage = Pick<Storage, 'setItem'>;
type DeleteStorage = Pick<Storage, 'removeItem'>;

function looksLikeCharacterState(value: unknown): value is CharacterState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<CharacterState>;
  return (
    typeof state.level === 'number' &&
    Number.isFinite(state.level) &&
    typeof state.xp === 'number' &&
    Number.isFinite(state.xp) &&
    typeof state.copper === 'number' &&
    Number.isFinite(state.copper)
  );
}

function isPlayerClass(value: unknown): value is PlayerClass {
  return typeof value === 'string' && ALL_CLASSES.includes(value as PlayerClass);
}

export function readCampaignSave(storage: ReadStorage | null): CampaignSaveEnvelope | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(CAMPAIGN_SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CampaignSaveEnvelope>;
    if (parsed.version !== 1 || typeof parsed.savedAt !== 'number') return null;
    if (!isPlayerClass(parsed.playerClass)) return null;
    if (typeof parsed.name !== 'string' || parsed.name.length < 2 || parsed.name.length > 24) return null;
    if (!looksLikeCharacterState(parsed.state)) return null;
    return {
      version: 1,
      savedAt: parsed.savedAt,
      playerClass: parsed.playerClass,
      name: parsed.name,
      state: parsed.state,
      ...(parsed.appearance && typeof parsed.appearance === 'object'
        ? { appearance: parsed.appearance }
        : {}),
    };
  } catch {
    return null;
  }
}

export function writeCampaignSave(
  storage: WriteStorage | null,
  playerClass: PlayerClass,
  name: string,
  state: CharacterState,
  appearance?: Record<string, unknown> | null,
  savedAt = Date.now(),
): boolean {
  if (!storage) return false;
  const envelope: CampaignSaveEnvelope = {
    version: 1,
    savedAt,
    playerClass,
    name,
    state,
    ...(appearance ? { appearance } : {}),
  };
  try {
    storage.setItem(CAMPAIGN_SAVE_KEY, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

export function clearCampaignSave(storage: DeleteStorage | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(CAMPAIGN_SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
