"use client";
import { useRef } from "react";
import { GameStates, ClickType, Tile, Row, Field, Options } from "./types";
import {
	generateMineField,
	floodMaskField,
	toggleFlagAt,
	exposeNeighours,
} from "./changeMineField";

export default function GameBoard({
	options,
	mineField,
	setMineField,
	gameStatus,
}: {
	options: Options;
	mineField: Field;
	setMineField: (f: Field) => void;
	gameStatus: GameStates;
}) {
	console.log("re-rendering gameboard...");

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
				const newGen: Field = generateMineField(options, y, x);
				setMineField(floodMaskField(newGen, options.width, y, x));
			} else setMineField(floodMaskField(mineField, options.width, y, x));
		} else if (clickType === "right") {
			if (tile.mask !== true) setMineField(toggleFlagAt(mineField, y, x));
		} else if (tile.mask === true) {
			console.log("double click", y, x);
			setMineField(exposeNeighours(mineField, options.width, y, x));
		}
	}

	const rows = mineField.map((r, i) => {
		return <BoardRow key={i} row={r} handleClick={handleClick} y={i} />;
	});

	return (
		<>
			<div
				className="m-5 flex flex-col gap-1 bg-(--accent) p-2"
				onContextMenu={(e) => {
					e.preventDefault();
				}}
			>
				{rows}
			</div>
		</>
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
	return <div className="flex flex-row gap-1">{tiles}</div>;
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
				className="flex h-7 w-7 cursor-pointer justify-center-safe bg-(--foreground) font-bold text-(--background)"
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
				className="flex h-7 w-7 cursor-pointer justify-center-safe bg-(--highlight) font-bold text-(--background)"
				onMouseDown={(e) => handleMouseDown(e)}
				onMouseUp={(e) => handleMouseUp(e)}
			>
				<img src="Cross.ico" className="size-6 place-self-center" />
			</div>
		);
	else
		return (
			<div
				className="flex h-7 w-7 cursor-pointer justify-center-safe bg-(--background) font-bold text-(--foreground)"
				onMouseDown={(e) => handleMouseDown(e)}
				onMouseUp={(e) => handleMouseUp(e)}
			>
				{/* {tile.type} */}
			</div>
		);
}
