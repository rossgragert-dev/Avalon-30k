import { emptyZoneProps, type WorldContent, type ZoneDef } from './types';

/**
 * Deliberately sparse single-player performance baseline.
 *
 * This is not a reduced Eastbrook. It is a tiny neutral world definition whose
 * only jobs are to prove movement, class combat, loot, death/respawn, Local vs
 * Remote simulation, and sustained iPhone thermal stability.
 */
const START = { x: 0, z: 0 } as const;

const BASELINE_ZONE: ZoneDef = {
  id: 'nameless_road_baseline',
  name: 'Quiet Clearing',
  xMin: -120,
  xMax: 120,
  zMin: -120,
  zMax: 120,
  levelRange: [1, 3],
  worldPvp: 'sanctuary',
  biome: 'vale',
  hub: { x: 0, z: 0, radius: 20, name: 'Quiet Clearing' },
  graveyard: { x: -8, z: -8 },
  lakes: [],
  pois: [],
  welcome: '',
};

export const LEAN_CAMPAIGN_WORLD: WorldContent = {
  zones: [BASELINE_ZONE],
  camps: [
    {
      mobId: 'forest_wolf',
      center: { x: 0, z: 34 },
      radius: 7,
      count: 2,
      offStream: true,
    },
  ],
  npcs: {},
  groundObjects: [],
  roads: [],
  props: emptyZoneProps(),
  playerStart: { ...START },
  services: {
    graveyards: [
      {
        id: 'nameless_road_baseline_graveyard',
        name: 'Quiet Clearing',
        x: -8,
        z: -8,
      },
    ],
  },
  terrainEdits: [],
  placements: [],
  blockers: [],
  // Keep accidental low terrain from becoming an expensive animated water
  // surface in this performance baseline.
  waterLevel: -100,
};

export const LEAN_CAMPAIGN_ENEMY_COUNT = LEAN_CAMPAIGN_WORLD.camps.reduce(
  (sum, camp) => sum + camp.count,
  0,
);
