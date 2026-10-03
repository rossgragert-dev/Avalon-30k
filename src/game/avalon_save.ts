import type { CharacterState } from '../sim/character_state';

export const AVALON_SAVE_KEY = 'avalon30k.save.v1';

export interface AvalonSaveEnvelope {
  version: 1;
  savedAt: number;
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

export function readAvalonSave(storage: ReadStorage | null): AvalonSaveEnvelope | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(AVALON_SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AvalonSaveEnvelope>;
    if (parsed.version !== 1 || typeof parsed.savedAt !== 'number') return null;
    if (!looksLikeCharacterState(parsed.state)) return null;
    return {
      version: 1,
      savedAt: parsed.savedAt,
      state: parsed.state,
      ...(parsed.appearance && typeof parsed.appearance === 'object'
        ? { appearance: parsed.appearance }
        : {}),
    };
  } catch {
    return null;
  }
}

export function writeAvalonSave(
  storage: WriteStorage | null,
  state: CharacterState,
  appearance?: Record<string, unknown> | null,
  savedAt = Date.now(),
): boolean {
  if (!storage) return false;
  const envelope: AvalonSaveEnvelope = {
    version: 1,
    savedAt,
    state,
    ...(appearance ? { appearance } : {}),
  };
  try {
    storage.setItem(AVALON_SAVE_KEY, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

export function clearAvalonSave(storage: DeleteStorage | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(AVALON_SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
