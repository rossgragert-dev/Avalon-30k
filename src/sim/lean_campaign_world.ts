import { BUILTIN_WORLD } from './data';
import type { WorldContent } from './types';

/**
 * Deliberately sparse single-player performance baseline.
 *
 * The class/combat/inventory systems live outside WorldContent, so we can keep
 * those intact while stripping the donor MMO world's authored population and
 * dressing. Start tiny, prove thermal stability, then add content back on purpose.
 */
const EMPTY_PROPS = Object.fromEntries(
  Object.keys(BUILTIN_WORLD.props).map((key) => [key, []]),
) as unknown as WorldContent['props'];

const start = { ...BUILTIN_WORLD.playerStart };

export const LEAN_CAMPAIGN_WORLD: WorldContent = {
  zones: BUILTIN_WORLD.zones.slice(0, 1),
  camps: [
    {
      mobId: 'forest_wolf',
      center: { x: start.x, z: start.z + 42 },
      radius: 11,
      count: 3,
      offStream: true,
    },
  ],
  npcs: {},
  groundObjects: [],
  roads: [[start, { x: start.x, z: start.z + 55 }]],
  props: EMPTY_PROPS,
  playerStart: start,
  services: {
    stations: [],
    mailboxes: [],
    noticeboards: [],
    musterBoards: [],
    graveyards: BUILTIN_WORLD.services?.graveyards?.slice(0, 1) ?? [],
  },
  terrainEdits: [],
  placements: [],
  blockers: [],
};

export const LEAN_CAMPAIGN_ENEMY_COUNT = LEAN_CAMPAIGN_WORLD.camps.reduce(
  (sum, camp) => sum + camp.count,
  0,
);
