# Avalon 30K — Project Direction

## Core identity

Avalon 30K is a **single-player open-world sci-fantasy action RPG** built from the open-source World of ClaudeCraft codebase.

World of ClaudeCraft is a technical foundation, not the design target. Avalon 30K will progressively replace the original setting, branding, player-facing content, online assumptions, and restricted media while retaining useful engine systems.

## Player fantasy

The player begins as **Lancelot**, alone on a distant world in the far-future Avalon setting. Exploration, combat, discovery, quests, equipment, Resonance, and story progression gradually expand the player's capabilities and reveal the larger setting.

Other major characters are **story companions and recruitable allies**, not other human players. The game may eventually support a controllable or AI-assisted party, but the experience remains single-player.

## Design pillars

1. **Single-player first**
   - No account or server should be required to play.
   - Local/offline simulation is the authoritative gameplay path.
   - Saving and loading should be local and reliable.

2. **Open-world exploration**
   - Connected explorable regions rather than MMO queues and social hubs.
   - Hand-authored discoveries, quests, landmarks, ruins, settlements, and encounters.
   - Travel should reward curiosity rather than simply moving between quest markers.

3. **Character-driven RPG**
   - Lancelot is the initial protagonist.
   - The player does not begin by choosing one of nine MMO classes.
   - Existing internal class IDs may remain temporarily as compatibility scaffolding while player-facing systems are replaced.
   - New progression should emphasize the identity, equipment, skills, Resonance, and choices of named characters.

4. **Companions instead of multiplayer**
   - Existing party, threat, healing, buff, and group-combat systems may be repurposed for AI companions.
   - Matchmaking, guilds, PvP, trading, player mail, player markets, social chat, and online presence are not part of the target game.

5. **Make the foundation our own**
   - Preserve useful simulation, rendering, movement, combat, quest, NPC, inventory, world, weather, map, controller/mobile, and progression technology.
   - Replace World of ClaudeCraft lore, names, UI identity, economy assumptions, and MMO-specific gameplay where they do not serve Avalon 30K.
   - Do not preserve a system merely because it already exists.

## Systems to retain or repurpose

- Three.js renderer and environment pipeline
- Character movement and camera
- Mobile/touch and controller support
- Deterministic simulation
- Combat and ability framework
- NPC and enemy framework
- Quest/objective framework
- Inventory, equipment, loot, vendors, and item framework
- Experience and progression foundations
- Talent/skill infrastructure where useful
- World terrain, water, weather, collision, roads, props, interiors, and zone infrastructure
- Dialogue and interaction foundations
- Map/minimap foundations
- Local save/load foundation
- Companion-capable party mechanics
- Mount/vehicle foundations where appropriate

## Systems to disable, remove, or replace

These are not design requirements for Avalon 30K:

- Account registration/login
- Authoritative multiplayer server
- Shared realms
- Other human players
- Guilds
- PvP/arenas/battlegrounds
- Dungeon Finder / matchmaking
- Player trading
- Auction/World Market
- Multiplayer mail
- Leaderboards
- Online population/status systems
- Social chat/whispers
- Web3/wallet/token systems
- Live-service daily rewards
- Multiplayer-specific anti-cheat and moderation
- MMO raid-role requirements

Some of these systems can remain dormant during early conversion milestones if removing them immediately would destabilize useful shared code.

## Internal compatibility rule

During early milestones, **do not rename stable internal IDs simply for presentation**.

For example, Lancelot may initially use the internal `warrior` player-class ID while the UI identifies him as Lancelot / Knight of the First Circle. Once the single-player path is stable, we can refactor the underlying type system deliberately.

This minimizes cascading changes while the fork is being established.

## Asset rule

The World of ClaudeCraft source code is MIT licensed, but media assets have mixed licensing. `CREDITS.md` remains authoritative for upstream asset permissions.

For Avalon 30K:

- retain the upstream MIT license and required notices;
- use clearly redistributable assets only as temporary or permanent foundations according to their licenses;
- replace rights-reserved, permission-only, World of ClaudeCraft-branded, or unclear media before a standalone public release;
- record provenance for new Avalon 30K assets.

## Milestone plan

### v0.1 — Single-player foundation

Goal: prove that the fork is now Avalon 30K without destabilizing gameplay.

- establish Avalon 30K project identity;
- make local single-player the intended development path;
- remove/hide obvious online/MMO entry choices from the primary player flow;
- retain the existing world temporarily as a technical test map;
- keep combat, NPC interaction, quests, inventory, map, progression, and saving functional;
- use Lancelot as the intended protagonist while preserving compatible internal IDs where necessary.

### v0.2 — Lancelot playable conversion

- replace player-facing class selection with the Lancelot starting character;
- establish his baseline stats, equipment, sword combat, abilities, and early Resonance direction;
- replace inappropriate starter equipment and fantasy-MMO copy;
- begin replacing restricted/brand-specific visual assets.

### v0.3 — Avalon 30K opening region

- replace the legacy starter experience with the first Avalon 30K region;
- begin with Lancelot alone on an unfamiliar world;
- add original landmarks, enemies, NPCs, and the first quest chain;
- create a clear opening objective while preserving optional exploration.

### v0.4 — Companion foundation

- repurpose group mechanics for AI story companions;
- implement recruitment, follow/hold behavior, combat participation, and companion persistence;
- no multiplayer dependency.

### Later milestones

- expand the open world;
- deepen character progression and Resonance;
- add major companions and faction/story systems;
- replace remaining legacy content;
- remove dormant MMO/server/Web3 systems once no useful single-player code depends on them.

## Non-goals

Avalon 30K is **not** intended to become:

- an MMORPG;
- a live-service game;
- a player economy;
- a reskin of World of ClaudeCraft;
- a class-selection MMO with Avalon names pasted over the original content.

The goal is an original single-player RPG that happens to begin with a strong open-source technical foundation.
