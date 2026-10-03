import type { PlayerClass } from '../sim/types';

/**
 * Early-conversion compatibility identity.
 *
 * Lancelot is the actual Avalon 30K protagonist. The inherited simulation still
 * keys a large amount of combat/equipment behavior off PlayerClass, so v0.1
 * deliberately maps him onto the stable warrior id rather than renaming that id
 * across the engine before the single-player path is proven.
 */
export const AVALON_PROTAGONIST_NAME = 'Lancelot';
export const AVALON_PROTAGONIST_TITLE = 'Knight of the First Circle';
export const AVALON_PROTAGONIST_CLASS: PlayerClass = 'warrior';
