import { describe, expect, it } from 'vitest';
import { isOfflineModeAvailable } from '../src/game/offline_mode_gate';

describe('isOfflineModeAvailable', () => {
  it('is available under dev builds', () => {
    expect(isOfflineModeAvailable(true)).toBe(true);
  });

  it('remains available in production builds for Avalon 30K single-player', () => {
    expect(isOfflineModeAvailable(false)).toBe(true);
  });
});
