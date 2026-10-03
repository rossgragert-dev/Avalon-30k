# Avalon 30K

**Avalon 30K is a single-player open-world sci-fantasy RPG prototype.**

This repository is a fork of [World of ClaudeCraft](https://github.com/levy-street/world-of-claudecraft) and is being progressively converted into an original single-player game set in the Avalon 30K universe.

## Current status

The project is at **v0.1 — Single-player foundation**.

The existing World of ClaudeCraft gameplay remains largely intact while the fork is separated from its MMO assumptions. The immediate goal is to preserve the systems that already work — movement, combat, quests, NPCs, inventory, progression, world simulation, rendering, controller/mobile support, and local play — while making **offline single-player the primary game path**.

The initial protagonist will be **Lancelot**. Existing internal class identifiers may remain temporarily as compatibility scaffolding, but Avalon 30K will ultimately be character-driven rather than based around an MMO class-selection screen.

See [docs/AVALON-30K-DIRECTION.md](docs/AVALON-30K-DIRECTION.md) for the design and conversion plan.

## Target game

Avalon 30K is intended to become:

- a single-player open-world RPG;
- a character-driven sci-fantasy adventure;
- playable without accounts or an authoritative server;
- built around exploration, combat, quests, equipment, progression, Resonance, and story;
- capable of supporting recruitable AI companions;
- browser/desktop/mobile friendly where the inherited engine makes that practical.

It is **not** intended to remain an MMORPG.

Systems such as guilds, PvP, matchmaking, shared realms, player markets, trading, online chat, leaderboards, Web3, and live-service features are considered legacy systems to disable or remove as the conversion progresses.

## Development approach

We are intentionally converting the game incrementally rather than deleting the MMO architecture all at once.

Early milestones will preserve stable internal IDs and proven systems while replacing player-facing identity and routing. Once the single-player path is stable, deeper systems can be simplified or removed safely.

The original starter world may therefore remain temporarily as a **technical test environment** while Avalon 30K content is built.

## Technology inherited from World of ClaudeCraft

The fork currently uses the upstream TypeScript/Three.js/Vite architecture and deterministic simulation core. World content is largely authored as TypeScript data, which allows zones, quests, enemies, NPCs, abilities, items, and progression to be replaced incrementally without rebuilding the rendering engine.

For local development, the inherited offline path currently uses:

```bash
npm install -g pnpm@10.34.5
pnpm install --frozen-lockfile
pnpm run dev
```

The exact player entry flow will change as v0.1 removes the MMO-oriented mode selection.

## Licensing and upstream attribution

The World of ClaudeCraft **source code** is licensed under the MIT License. This fork retains the upstream license and notices.

Media assets in the upstream repository have mixed licensing and are **not automatically covered by the MIT license**. The upstream `CREDITS.md` is the authority for those permissions. Avalon 30K will replace World of ClaudeCraft-branded, rights-reserved, permission-only, and unclear media as development progresses.

Original World of ClaudeCraft project:

https://github.com/levy-street/world-of-claudecraft
