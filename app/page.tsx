"use client";
import { useState } from "react";

export default function Home() {
	return (
		<div className="flex h-full flex-col place-items-center justify-center-safe">
			<h1 className="font-mono text-4xl font-bold">REACT SWEEPER</h1>
			<h2 className="m-5 font-sans text-xl">the game</h2>
			<br />
			<h2 className="m-5 font-mono text-xl">GAMEPLAY</h2>
			<GameBoard width={15} heigth={15} />
		</div>
	);
}

type Tile =
	| "O" /* BEFORE GENERATING */ // ---- remove after adding started state
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

type Row = Array<Tile>;

function GameBoard({ width, heigth }: { width: number; heigth: number }) {
	const [mineField, setMineField] = useState<Array<Row>>(
		Array<Row | null>(heigth)
			.fill(null)
			.map((r) => new Array<Tile>(width).fill("O")),
	);

	// when a tile is clicked generate map (later add the rest of the game)
	function handleClick(tile: Tile, y: number, x: number) {
		console.log("CLICKED", y, x);
		if (tile === "O") {
			// ------ activate a started state so that the timer starts counting
			setMineField(generateMineField(mineField, width, heigth, y, x));
			return;
		}
		if (tile === "B") {
			// ------ stop started state for timer to stop
			;
		}
	}

	const rows = mineField.map((r, i) => {
		return <BoardRow key={i} row={r} handleClick={handleClick} y={i} />;
	});

	return (
		<div className="m-5 flex flex-col gap-2 bg-(--accent) p-2">{rows}</div>
	);
}

function generateMineField(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	let tempField: Array<Row> = mineField.slice();
	tempField.forEach((item, idx, row) => {
		row[idx].fill(" ");
	});

	console.log("force empty at ", y, x);

	const totalBombs: number = Math.floor((width * heigth) / 5); // !! change the 5 based on difficulty

	for (let placedBombs = 0; placedBombs < totalBombs;) {
		let bombY = Math.floor(Math.random() * heigth);
		let bombX = Math.floor(Math.random() * width);
		if (bombY !== y && bombX !== x && tempField[bombY][bombX] !== "B") {
			tempField[bombY][bombX] = "B";
			placedBombs++;
			console.log("placing bomb ", placedBombs, " on ", bombY, bombX);
		}
	}

	// ------ add the numbers of neighbouring bombs

	return tempField;
}

function BoardRow({
	row,
	handleClick,
	y,
}: {
	row: Row;
	handleClick: (tile: Tile, y: number, x: number) => void;
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
	handleClick: (tile: Tile, y: number, x: number) => void;
	y: number;
	x: number;
}) {
	const [show, setShow] = useState<boolean>(true);

	// !! if it's showing no click handler
	/* if (show) { */
	return (
		<div
			className="h-5 w-5 bg-(--foreground) text-(--background)"
			onClick={() => {
				handleClick(tile, y, x);
				setShow(true);
			}}
		>
			{tile}
		</div>
	);
	/* 	} else
		return (
			<div
				className="h-5 w-5 bg-(--background)"
				onClick={() => {
					handleClick(tile, show, y, x);
					setShow(true);
				}}
			></div>
		); */
}
