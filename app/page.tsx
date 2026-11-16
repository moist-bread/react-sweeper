"use client";
import { useState, useRef } from "react";
import { GameStates, ClickType, TileType, Tile, Row } from "./types";
import {
	generateMineField,
	floodMaskField,
	toggleFlagAt,
	checkWinCondition,
	exposeNeighours,
} from "./changeMineField";

// !! TO-DO
// -- difficulty and size select
// -- gameboard history with ctrl z ctrl shift z (game status history as well?)

export default function Home() {
	const [options, setOptions] = useState({ width: 15, heigth: 15 }); // size and dificulty changes
	const [mineField, setMineField] = useState<Array<Row>>(
		Array<Row | null>(options.heigth)
			.fill(null)
			.map((r) =>
				new Array<Tile>(options.width).fill({ type: "X", mask: false }),
			),
	);

	const detectedBombs: number = countBombs(mineField);
	const gameStatus: GameStates = detectGameState(mineField);
	console.log("CALCULATED STATE:", gameStatus);

	return (
		<Background gameStatus={gameStatus}>
			<h1 className="font-mono text-4xl font-bold">REACT SWEEPER</h1>
			<h2 className="m-5 font-sans text-xl">the game</h2>
			<br />
			<button
				onClick={() => {
					setMineField(
						Array<Row | null>(options.heigth)
							.fill(null)
							.map((r) =>
								new Array<Tile>(options.width).fill({
									type: "X",
									mask: false,
								}),
							),
					);
				}}
			>
				RESET
			</button>
			<Timer status={gameStatus} />
			<h2 className="m-5 font-mono text-xl">GAMEPLAY</h2>
			{/* later limit it to 3 chars like the timer */}
			<div className="m-2 bg-(--accent) p-2 font-bold">
				{Math.floor((options.width * options.heigth) / 5) -
					detectedBombs}
			</div>
			<GameBoard
				width={options.width}
				heigth={options.heigth}
				mineField={mineField}
				setMineField={setMineField}
				gameStatus={gameStatus}
			/>
		</Background>
	);
}

function Background({
	gameStatus,
	children,
}: {
	gameStatus: GameStates;
	children: Array<React.JSX.Element>;
}) {
	let style =
		"flex h-full w-full flex-col place-items-center justify-center-safe";
	if (gameStatus === "lose")
		style =
			"flex h-full w-full flex-col place-items-center justify-center-safe bg-(--highlight)";
	if (gameStatus === "win")
		style =
			"flex h-full w-full flex-col place-items-center justify-center-safe bg-(--accent)";

	return <div className={style}>{children}</div>;
}

function detectGameState(mineField: Array<Row>): GameStates {
	if (mineField.length > 0 && mineField[0][0].type === "X") return "before";

	if (checkWinCondition(mineField)) return "win";

	for (let y = 0; y < mineField.length; y++) {
		const row = mineField[y];
		for (let x = 0; x < row.length; x++) {
			const tile = row[x];
			if (tile.type === "B" && tile.mask === true) return "lose";
		}
	}
	return "during";
}

function Timer({ status }: { status: GameStates }) {
	const [seconds, setSeconds] = useState<number>(0);

	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
	if (timerIntervalRef.current === null && status === "during") {
		timerIntervalRef.current = setInterval(() => {
			setSeconds((s) => {
				if (s + 1 == 6000) {
					if (timerIntervalRef.current !== null)
						clearInterval(timerIntervalRef.current);
					return 5999;
				}
				return s + 1;
			});
		}, 100);
	} else if (timerIntervalRef.current !== null && status !== "during") {
		clearInterval(timerIntervalRef.current);
		if (status === "before") {
			timerIntervalRef.current = null;
			setSeconds(0);
		}
	}

	const mins = Math.floor(seconds / 60);
	const secs = seconds - mins * 60;
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
	mineField,
	setMineField,
	gameStatus,
}: {
	width: number;
	heigth: number;
	mineField: Array<Row>;
	setMineField: React.Dispatch<React.SetStateAction<Array<Row>>>;
	gameStatus: GameStates;
}) {
	console.log("re-rendering...");

	function handleClick(
		tile: Tile,
		y: number,
		x: number,
		clickType: ClickType,
	) {
		if (gameStatus === "lose" || gameStatus === "win") return;
		if (clickType === "left") {
			if (tile.mask !== false) return;
			if (gameStatus === "before") {
				setMineField(generateMineField(width, heigth, y, x));
			}
			setMineField((f) => floodMaskField(f, width, heigth, y, x));
		} else if (clickType === "right") {
			if (tile.mask !== true) setMineField(toggleFlagAt(mineField, y, x));
		} else if (tile.mask === true) {
			console.log("double click", y, x);
			setMineField(exposeNeighours(mineField, width, heigth, y, x));
		}
	}

	const rows = mineField.map((r, i) => {
		return <BoardRow key={i} row={r} handleClick={handleClick} y={i} />;
	});

	return (
		<>
			<div
				className="m-5 flex flex-col gap-2 bg-(--accent) p-2"
				onContextMenu={(e) => {
					e.preventDefault();
				}}
			>
				{rows}
			</div>
		</>
	);
}

function countBombs(mineField: Array<Row>) {
	return mineField.reduce(
		(total, row) =>
			total +
			row.reduce(
				(total, t) => (t.mask === "flag" ? total + 1 : total),
				0,
			),
		0,
	);
}

function BoardRow({
	row,
	handleClick,
	y,
}: {
	row: Row;
	handleClick: (
		tile: Tile,
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
		tile: Tile,
		y: number,
		x: number,
		clickType: ClickType,
	) => void;
	y: number;
	x: number;
}) {
	const leftActive = useRef<boolean>(false);
	const rightActive = useRef<boolean>(false);

	function handleMouseDown(e: React.MouseEvent) {
		if (e.button === 0) {
			leftActive.current = true;
			console.log("Left down");
		} else {
			rightActive.current = true;
			console.log("Right down");
		}
	}

	function handleMouseUp(e: React.MouseEvent) {
		if (leftActive.current && rightActive.current) {
			handleClick(tile, y, x, "both");
			leftActive.current = false;
			rightActive.current = false;
		} else if (leftActive.current) handleClick(tile, y, x, "left");
		else if (rightActive.current) handleClick(tile, y, x, "right");

		if (e.button === 0) {
			leftActive.current = false;
			console.log("Left up");
		} else {
			rightActive.current = false;
			console.log("Right up");
		}
	}

	if (tile.mask === true) {
		return (
			<div
				className="flex h-7 w-7 justify-center-safe bg-(--foreground) font-bold text-(--background)"
				onMouseDown={(e) => handleMouseDown(e)}
				onMouseUp={(e) => handleMouseUp(e)}
			>
				{tile.type === "B" ? (
					<img src="Apple.ico" className="size-6 place-self-center" />
				) : (
					tile.type
				)}
			</div>
		);
	} else if (tile.mask === "flag")
		return (
			<div
				className="flex h-7 w-7 justify-center-safe bg-(--highlight) font-bold text-(--background)"
				onMouseDown={(e) => handleMouseDown(e)}
				onMouseUp={(e) => handleMouseUp(e)}
			>
				<img src="Cross.ico" className="size-6 place-self-center" />
			</div>
		);
	else
		return (
			<div
				className="flex h-7 w-7 justify-center-safe bg-(--background) font-bold text-(--foreground)"
				onMouseDown={(e) => handleMouseDown(e)}
				onMouseUp={(e) => handleMouseUp(e)}
			>
				{/* {tile.type} */}
			</div>
		);
}
