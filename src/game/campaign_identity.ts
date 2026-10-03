import type { PlayerClass } from '../sim/types';

/**
 * Working identity for the replayable single-player campaign.
 *
 * The protagonist begins without a known personal name, homeland, title, or
 * allegiance. "Wanderer" is an engine-safe handle only; later narrative systems
 * can replace it with an earned/adopted identity without changing class mechanics.
 */
export const CAMPAIGN_PROTAGONIST_NAME = 'Wanderer';

export const CLASS_MEMORY_HOOKS: Record<PlayerClass, string> = {
  warrior:
    'Your name is gone, but your body remembers balance, steel, and the instant before a battle begins.',
  paladin:
    'An oath rises to your lips before you can remember who taught it to you—or whom you once served.',
  hunter:
    'Tracks, wind, distance, and danger make immediate sense. The wilderness feels more familiar than your own past.',
  rogue:
    'Your hands remember hidden catches, quiet steps, and where people keep the things they do not want found.',
  priest:
    'Old prayers return before your own name does. You do not yet know whether anyone is listening.',
  shaman:
    'The wind and stone feel crowded with meaning. Something in the world recognizes you even when you do not.',
  mage:
    'Arcane patterns are as natural as breath. You remember how to shape power, but not who taught you.',
  warlock:
    'When you reach toward the dark, something reaches back. The unsettling part is how familiar that feels.',
  druid:
    'Living things speak in patterns you somehow understand. Civilization feels strange; the older world does not.',
};

export function classMemoryHook(cls: PlayerClass): string {
  return CLASS_MEMORY_HOOKS[cls];
}
