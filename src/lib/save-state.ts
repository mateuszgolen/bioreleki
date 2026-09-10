/** Wynik akcji zapisu profilu — współdzielony przez server action i formularz. */
export type SaveState = { status: "idle" | "saved"; at: number };

export const initialSaveState: SaveState = { status: "idle", at: 0 };
