import { describe, expect, it } from 'vitest';
import {
  CAMPAIGN_PROTAGONIST_NAME,
  CLASS_MEMORY_HOOKS,
  classMemoryHook,
} from '../src/game/campaign_identity';
import { ALL_CLASSES } from '../src/sim/types';

describe('unknown protagonist identity', () => {
  it('uses an engine-safe temporary handle while the true identity is unknown', () => {
    expect(CAMPAIGN_PROTAGONIST_NAME).toBe('Wanderer');
  });

  it('gives every playable class a distinct first memory hook', () => {
    expect(Object.keys(CLASS_MEMORY_HOOKS).sort()).toEqual([...ALL_CLASSES].sort());
    const hooks = ALL_CLASSES.map((cls) => classMemoryHook(cls));
    expect(new Set(hooks).size).toBe(ALL_CLASSES.length);
    hooks.forEach((hook) => expect(hook.length).toBeGreaterThan(40));
  });
});
