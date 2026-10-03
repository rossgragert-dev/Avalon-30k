// This fork is a single-player game. The inherited World of ClaudeCraft
// "offline" Sim is therefore the authoritative local gameplay path rather than
// a development-only convenience.
//
// Keep the parameter for compatibility with existing donor call sites while the
// launcher/server split is simplified incrementally.
export function isOfflineModeAvailable(_isDev: boolean): boolean {
  return true;
}
