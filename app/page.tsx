"use client";
import { useState, useRef } from "react";
import { GameStates, ClickType, TileType, Tile, Row } from "./types";
import { generateMineField, floodMaskField } from "./changeMineField";

// !! TO-DO
// -- add visual identifier for flag tile
// -- add visual identifier for game lose
// -- bomb  counter
// -- winning condition
// -- implement the result of both click
// -- difficulty select


export default function Home() {
	const [gameSeed, setGameSeed] = useState<number>(0);
	const [gameStatus, setGameStatus] = useState<GameStates>("before");
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
					setGameStatus("before");
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
				gameStatus={gameStatus}
				handleStart={(s: GameStates) => {
					setGameStatus(s);
					if (s === "during") handleStartTimer();
					else if (s === "lose") handleStopTimer();
					else if (s === "win") handleStopTimer(); // -- these will do more in the future
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

function GameBoard({
	width,
	heigth,
	gameStatus,
	handleStart,
}: {
	width: number;
	heigth: number;
	gameStatus: GameStates;
	handleStart: (s: GameStates) => void;
}) {
	const [mineField, setMineField] = useState<Array<Row>>(
		Array<Row | null>(heigth)
			.fill(null)
			.map((r) =>
				new Array<Tile>(width).fill({ type: " ", mask: false }),
			),
	);

	const detectedBombs: number = 0;
	// -- count number of mask FLAGS in the mineField

	function handleClick(
		type: TileType,
		y: number,
		x: number,
		clickType: ClickType,
	) {
		if (gameStatus === "lose" || gameStatus === "win") return;
		if (clickType === "right") {
			console.log("SET FLAG AT", y, x);
		} else if (clickType === "left") {
			if (gameStatus === "before") {
				setMineField(generateMineField(mineField, width, heigth, y, x));
				handleStart("during");
			} else if (type === "B") {
				handleStart("lose");
			}
			setMineField((f) => floodMaskField(f, width, heigth, y, x));
		} else console.log("double click", y, x);
	}

	const rows = mineField.map((r, i) => {
		return <BoardRow key={i} row={r} handleClick={handleClick} y={i} />;
	});

	return (
		<div
			className="m-5 flex flex-col gap-2 bg-(--accent) p-2"
			onContextMenu={(e) => {
				e.preventDefault();
			}}
		>
			{rows}
		</div>
	);
}

function BoardRow({
	row,
	handleClick,
	y,
}: {
	row: Row;
	handleClick: (
		tile: TileType,
		y: number,
		x: number,
		clickType: ClickType,
	) => void;
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
	handleClick: (
		tile: TileType,
		y: number,
		x: number,
		clickType: ClickType,
	) => void;
	y: number;
	x: number;
}) {
	const leftActive = useRef<boolean>(false);
	const rightActive = useRef<boolean>(false);

	// !! if it's showing no click handler
	// !! make shown bombs RED
	if (tile.mask === true) {
		return (
			<div className="h-7 w-7 bg-(--foreground) font-bold text-(--background)">
				{tile.type}
			</div>
		);
	} else if (tile.mask === "flag")
		// -- make it handle right click
		return (
			<div className="h-7 w-7 bg-(--highlight) font-bold text-(--background)">
				{tile.type}
			</div>
		);
	else
		return (
			<div
				className="h-7 w-7 bg-(--background) font-bold text-(--foreground)"
				onMouseDown={(e) => {
					if (e.button === 0) {
						leftActive.current = true;
						console.log("Left down");
					} else {
						rightActive.current = true;
						console.log("Right down");
					}
				}}
				onMouseUp={(e) => {
					if (leftActive.current && rightActive.current) {
						handleClick(tile.type, y, x, "both");
						leftActive.current = false;
						rightActive.current = false;
					} else if (leftActive.current)
						handleClick(tile.type, y, x, "left");
					else if (rightActive.current)
						handleClick(tile.type, y, x, "right");

					if (e.button === 0) {
						leftActive.current = false;
						console.log("Left up");
					} else {
						rightActive.current = false;
						console.log("Right up");
					}
				}}
			>
				{tile.type}
			</div>
		);
}
