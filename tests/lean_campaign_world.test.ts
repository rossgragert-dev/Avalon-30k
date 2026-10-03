import { afterEach, describe, expect, it } from 'vitest';
import { getActiveWorldContent, setActiveWorldContent } from '../src/sim/data';
import {
  LEAN_CAMPAIGN_ENEMY_COUNT,
  LEAN_CAMPAIGN_WORLD,
} from '../src/sim/lean_campaign_world';
import { Sim } from '../src/sim/sim';

afterEach(() => setActiveWorldContent(null));

describe('lean campaign world', () => {
  it('keeps only the minimal content needed for movement and combat testing', () => {
    expect(LEAN_CAMPAIGN_WORLD.zones).toHaveLength(1);
    expect(LEAN_CAMPAIGN_WORLD.zones[0]?.id).toBe('nameless_road_baseline');
    expect(LEAN_CAMPAIGN_WORLD.zones[0]?.lakes).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.zones[0]?.pois).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.playerStart).toEqual({ x: 0, z: 0 });
    expect(LEAN_CAMPAIGN_WORLD.roads).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.waterLevel).toBe(-100);
    expect(LEAN_CAMPAIGN_ENEMY_COUNT).toBe(2);
    expect(Object.keys(LEAN_CAMPAIGN_WORLD.npcs)).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.groundObjects).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.services?.stations).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.services?.mailboxes).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.services?.noticeboards).toHaveLength(0);
    expect(LEAN_CAMPAIGN_WORLD.services?.musterBoards).toBeUndefined();
    expect(LEAN_CAMPAIGN_WORLD.services?.graveyards).toHaveLength(1);
    for (const value of Object.values(LEAN_CAMPAIGN_WORLD.props)) {
      if (Array.isArray(value)) expect(value).toHaveLength(0);
    }
  });

  it('constructs a playable class Sim with only the authored two hostile mobs', () => {
    setActiveWorldContent(LEAN_CAMPAIGN_WORLD);
    expect(getActiveWorldContent()).toBe(LEAN_CAMPAIGN_WORLD);

    const sim = new Sim({
      seed: 42,
      playerClass: 'mage',
      playerName: 'Wanderer',
      compulsoryTutorial: false,
      world: LEAN_CAMPAIGN_WORLD,
      idleMobTickRadius: 60,
    });

    const hostileMobs = [...sim.entities.values()].filter(
      (e) => e.kind === 'mob' && e.hostile && e.ownerId === null,
    );
    expect(hostileMobs).toHaveLength(2);
    expect(hostileMobs.every((e) => e.templateId === 'forest_wolf')).toBe(true);
  });
});
