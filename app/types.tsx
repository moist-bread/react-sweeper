export type GameStates = "before" | "during" | "lose" | "win";

export type ClickType = "left" | "right" | "both";

export type TileType =
	| "X" /* BEFORE */
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
	mask: boolean | "flag"; // true: shown; false: covered; flag: covered w/ flag
};

export type Row = Array<Tile>;

export type Field = Array<Row>;

export type History = {
	past: Field | null;
	present: Field;
	future: Field | null;
};

export enum Difficulty {
	VERYHARD = 5,
	HARD,
	MEDIUM,
	EASY,
	VERYEASY,
}

export enum Size {
	EXTRASMALL = 5,
	SMALL = 10,
	AVERAGE = 20,
	LARGE = 25,
	EXTRALARGE = 35,
}

export type Options = {
	width: Size;
	heigth: Size;
	difficulty: Difficulty;
};
