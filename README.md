# The Nameless Road

**Working title.** This repository is being converted into a replayable, single-player fantasy RPG using the open-source **World of ClaudeCraft** codebase as its technical foundation.

## Core premise

You begin with no reliable memory of your name, homeland, family, title, or allegiance. Travelers found you after a violent storm and carried you to a frontier settlement. You remember how the world works, and one set of skills returns instinctively.

That first remembered skill is your **class**.

The long-term game is about two connected mysteries:

1. **Who were you?**
2. **Who will you choose to become now?**

The same world should support repeated playthroughs from different class perspectives. A Warrior may grow into a commander or unifier. A Mage may become a great sage studying dangerous ancient powers. A Rogue may uncover the same crisis through courts, hidden networks, and espionage. Other classes should reveal different pieces of the same larger mythology.

## v0.1 playable-slice goal

The first slice proves the reusable loop before major world replacement:

- single-player production entry;
- New Game / Continue;
- choose any inherited playable class;
- begin as the temporarily named **Wanderer**;
- class-specific first memory hook;
- retain inherited combat, equipment, talents, progression, quests, movement, camera, inventory, and open-world systems;
- autosave the full inherited `CharacterState` every 10 seconds and on background/exit;
- restore position, progression, inventory, equipment, quests, appearance, and chosen class with Continue;
- isolate campaign saves from editor/test/diagnostic offline sessions;
- bypass the donor MMO tutorial for campaign play.

The inherited world is temporary scenery for this slice. Replacing its locations, factions, quests, NPCs, lore, and restricted media is a later content phase.

## Design direction

The setting draws broad inspiration from mythic fantasy, Arthurian legend, deep-history fantasy, and dark high fantasy without copying their characters, factions, cosmology, terminology, or plots.

Current loose structure:

- a frontier region built over the remains of a fallen civilization;
- several rival kingdoms and powers moving toward conflict;
- old ruins and roads becoming dangerous again;
- an ancient force connected to the previous civilization's collapse;
- a recurring symbol tied to both the central mystery and the protagonist's forgotten past;
- shared world events with class-specific approaches, discoveries, and eventual identity outcomes.

## Development

Install dependencies and run the inherited Vite development client:

```bash
npm install
npm run dev
```

The donor project contains substantial server/MMO/live-service infrastructure. That code remains temporarily because removing tightly coupled systems all at once would create unnecessary regression risk. The normal player-facing path is being converted to local single-player first.

## Upstream and licensing

This project is derived from **World of ClaudeCraft** by Levy Street. Source code from the upstream project is MIT licensed and its copyright/license notices must be preserved.

Media assets in the upstream repository have mixed licensing. The upstream `CREDITS.md` remains the authority for asset provenance. Assets that are not clearly licensed for reuse must be replaced as this project develops.

This fork is not affiliated with or endorsed by Levy Street.
