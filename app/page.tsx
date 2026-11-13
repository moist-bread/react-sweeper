"use client";
import { useState, useRef } from "react";

export default function Home() {
	const [gameSeed, setGameSeed] = useState<number>(0);
	const [started, setStarted] = useState<boolean>(false);
	const [seconds, setSeconds] = useState<number>(0);

	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
	function handleStartTimer() {
		timerIntervalRef.current = setInterval(() => {
			setSeconds((s) => {
				if (s + 1 == 6000) {
					if (timerIntervalRef.current !== null)
						clearInterval(timerIntervalRef.current);
					return 5999;
				}
				return s + 1;
			});
		}, 1000);
	}
	function handleStopTimer() {
		if (timerIntervalRef.current !== null)
			clearInterval(timerIntervalRef.current);
	}

	

	return (
		<div className="flex h-full flex-col place-items-center justify-center-safe">
			<h1 className="font-mono text-4xl font-bold">REACT SWEEPER</h1>
			<h2 className="m-5 font-sans text-xl">the game</h2>
			<br />
			<button
				onClick={() => {
					setGameSeed((s) => s + 1);
					setStarted(false);
					handleStopTimer();
					setSeconds(0);
				}}
			>
				RESET
			</button>
			<Timer secs={seconds} />
			<h2 className="m-5 font-mono text-xl">GAMEPLAY</h2>
			<GameBoard
				key={gameSeed}
				width={15}
				heigth={15}
				started={started}
				handleStart={(s: boolean) => {
					setStarted(s);
					if (s) handleStartTimer();
					else handleStopTimer();
				}}
			/>
		</div>
	);
}

function Timer({ secs }: { secs: number }) {
	let mins = Math.floor(secs / 60);
	secs -= mins * 60;
	return (
		<div className="m-2 bg-(--accent) p-2 font-bold">
			{mins < 10 ? "0" : ""}
			{mins}:{secs < 10 ? "0" : ""}
			{secs}
		</div>
	);
}

type TileType =
	| " " /* EMPTY */
	| "B" /* BOMB */
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8 /* NUMBER OF BOMB NEIGHBOURS */;

type Tile = {
	tile: TileType;
	mask: boolean | "flag"; // -- CHANGE THE MASK TO CONSIDER FLAGGING BOMB
};

type Row = Array<Tile>;

function GameBoard({
	width,
	heigth,
	started,
	handleStart,
}: {
	width: number;
	heigth: number;
	started: boolean;
	handleStart: (s: boolean) => void;
}) {
	const [mineField, setMineField] = useState<Array<Row>>(
		Array<Row | null>(heigth)
			.fill(null)
			.map((r) =>
				new Array<Tile>(width).fill({ tile: " ", mask: false }),
			),
	);

	const detectedBombs: number = 0;
	// -- count number of mask FLAGS in the mineField

	function handleClick(tile: TileType, y: number, x: number) {
		if (!started) {
			setMineField(generateMineField(mineField, width, heigth, y, x));
			handleStart(true);
		} else if (tile === "B") {
			handleStart(false);
		}
		setMineField((f) => floodMaskField(f, width, heigth, y, x));
	}

	const rows = mineField.map((r, i) => {
		return <BoardRow key={i} row={r} handleClick={handleClick} y={i} />;
	});

	return (
		<div className="m-5 flex flex-col gap-2 bg-(--accent) p-2">{rows}</div>
	);
}

function floodMaskField(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	let tempField: Array<Row> = mineField.slice();
	floodFill(tempField, width, heigth, y, x);
	return tempField;
}

function floodFill(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	if (
		y < 0 ||
		y >= heigth ||
		x < 0 ||
		x >= width ||
		mineField[y][x].mask === true ||
		mineField[y][x].mask === "flag"
	)
		return;

	mineField[y][x] = { ...mineField[y][x], mask: true };
	if (mineField[y][x].tile !== " ") return;

	floodFill(mineField, width, heigth, y - 1, x - 1);
	floodFill(mineField, width, heigth, y - 1, x);
	floodFill(mineField, width, heigth, y - 1, x + 1);
	floodFill(mineField, width, heigth, y, x - 1);
	floodFill(mineField, width, heigth, y, x + 1);
	floodFill(mineField, width, heigth, y + 1, x - 1);
	floodFill(mineField, width, heigth, y + 1, x);
	floodFill(mineField, width, heigth, y + 1, x + 1);
}

function generateMineField(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	let tempField: Array<Row> = mineField.slice();
	/* console.log("force empty area at ", y, x); */

	const totalBombs: number = Math.floor((width * heigth) / 5); // !! change the 5 based on difficulty

	for (let placedBombs = 0; placedBombs < totalBombs;) {
		let bombY = Math.floor(Math.random() * heigth);
		let bombX = Math.floor(Math.random() * width);
		if (
			tempField[bombY][bombX].tile !== "B" &&
			(bombY > y + 1 || bombY < y - 1 || bombX > x + 1 || bombX < x - 1)
		) {
			tempField[bombY][bombX] = { tile: "B", mask: false };
			placedBombs++;
			/* console.log("placing bomb ", placedBombs, " on ", bombY, bombX); */
		}
	}

	tempField.forEach((row, y, field) => {
		row.forEach((tile, x) => {
			if (tile.tile === "B") return;

			let bombsAround: number = 0;

			const limitTop = Math.max(y - 1, 0);
			const limitBottom = Math.min(y + 2, heigth);
			for (let r = limitTop; r < limitBottom; r++) {
				const limitLeft = Math.max(x - 1, 0);
				const limitRight = Math.min(x + 2, width);
				for (let c = limitLeft; c < limitRight; c++)
					bombsAround += field[r][c].tile === "B" ? 1 : 0;
			}

			if (bombsAround !== 0)
				field[y][x] = { tile: bombsAround as TileType, mask: false };
		});
	});

	return tempField;
}

function BoardRow({
	row,
	handleClick,
	y,
}: {
	row: Row;
	handleClick: (tile: TileType, y: number, x: number) => void;
	y: number;
}) {
	const tiles = row.map((t, i) => {
		return (
			<BoardTile key={i} tile={t} handleClick={handleClick} y={y} x={i} />
		);
	});
	return <div className="flex flex-row gap-2">{tiles}</div>;
}

function BoardTile({
	tile,
	handleClick,
	y,
	x,
}: {
	tile: Tile;
	handleClick: (tile: TileType, y: number, x: number) => void;
	y: number;
	x: number;
}) {
	// !! if it's showing no click handler
	// !! make shown bombs RED
	if (tile.mask === true) {
		return (
			<div className="h-7 w-7 bg-(--foreground) font-bold text-(--background)">
				{tile.tile}
			</div>
		);
	} else if (tile.mask === "flag") // -- make it handle right click
		return (
			<div className="h-7 w-7 bg-(--highlight) font-bold text-(--background)">
				{tile.tile}
			</div>
		);
	else // -- make it handle right click
		return (
			<div
				className="h-7 w-7 bg-(--background) font-bold text-(--foreground)"
				onClick={() => {
					handleClick(tile.tile, y, x);
				}}
			>
				{tile.tile}
			</div>
		);
}
