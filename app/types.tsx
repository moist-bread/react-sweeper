export type GameStates = "before" | "during" | "lose" | "win";

export type ClickType = "left" | "right" | "both";

export type TileType =
	| " " /* EMPTY */
	| "B" /* BOMB */
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8; /* NUMBER OF BOMB NEIGHBOURS */

export type Tile = {
	type: TileType;
	mask: boolean | "flag"; // -- CHANGE THE MASK TO CONSIDER FLAGGING BOMB
};

export type Row = Array<Tile>;
