// Browser offline-world policy. The host supplies randomness before constructing
// the deterministic Sim; saved character identity takes precedence on reload.
import { nextRaidResetMs, nextWeeklyRaidResetMs } from '../reset_calendar';
import type { CharacterState } from '../sim/character_state';
import { PLAYER_INTEREST_DROP_RADIUS, type PlayerClass, type SimConfig } from '../sim/types';
import { WORLD_SEED } from '../sim/world_seed';
import { allocateOfflineGathererIdentity } from './gatherer_identity';

export function offlineWorldConfig(options: {
  readonly playerClass: PlayerClass;
  readonly name: string;
  readonly playerState?: CharacterState;
  readonly campaignSession?: boolean;
  readonly world?: SimConfig['world'];
  readonly seedOverride?: number;
  readonly devCommands: boolean;
}): SimConfig {
  return {
    lockoutNowMs: Date.now,
    raidResetMs: nextRaidResetMs,
    weeklyRaidResetMs: nextWeeklyRaidResetMs,
    seed: options.seedOverride ?? WORLD_SEED,
    playerClass: options.playerClass,
    playerName: options.name,
    playerState: options.playerState,
    devCommands: options.devCommands,
    // Editor play-test maps opt out of the live world's entry features.
    riftPortals: options.world === undefined,
    // The inherited proving-island tutorial belongs to the donor MMO. Campaign
    // sessions begin on the mainland while we replace that tutorial with our own
    // unknown-origin opening; editor/test sessions keep upstream behavior.
    compulsoryTutorial:
      options.world === undefined &&
      options.playerState === undefined &&
      options.campaignSession !== true,
    // Match live idle-AI throttling outside the player's actionable interest.
    idleMobTickRadius: PLAYER_INTEREST_DROP_RADIUS,
    world: options.world,
    gathererIdentity: allocateOfflineGathererIdentity() ?? undefined,
  };
}
