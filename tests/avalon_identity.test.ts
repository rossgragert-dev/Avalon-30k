import { describe, expect, it } from 'vitest';
import {
  AVALON_PROTAGONIST_CLASS,
  AVALON_PROTAGONIST_NAME,
  AVALON_PROTAGONIST_TITLE,
} from '../src/game/avalon_identity';

describe('Avalon 30K protagonist identity', () => {
  it('starts the conversion with Lancelot on the inherited warrior compatibility id', () => {
    expect(AVALON_PROTAGONIST_NAME).toBe('Lancelot');
    expect(AVALON_PROTAGONIST_TITLE).toBe('Knight of the First Circle');
    expect(AVALON_PROTAGONIST_CLASS).toBe('warrior');
  });
});
