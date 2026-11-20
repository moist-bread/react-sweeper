"use client";
import { useRef } from "react";
import {
	GameStates,
	ClickType,
	Tile,
	Row,
	Field,
	Options,
	Size,
} from "./types";
import {
	generateMineField,
	floodMaskField,
	toggleFlagAt,
	exposeNeighours,
} from "./changeMineField";
import {
	Button,
	IconSparkles,
	IconFish,
	IconClock,
	IconStar,
	IconZap,
} from "@frutiger.js/react";

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
			//console.log("double click", y, x);
			setMineField(exposeNeighours(mineField, options.width, y, x));
		}
	}

	const rows = mineField.map((r, i) => {
		return (
			<BoardRow
				key={i}
				row={r}
				handleClick={handleClick}
				y={i}
				options={options}
			/>
		);
	});

	return (
		<>
			<div
				className="m-5 flex flex-col gap-1 p-2"
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
	options,
}: {
	row: Row;
	handleClick: (
		tile: Tile,
		y: number,
		x: number,
		clickType: ClickType,
	) => void;
	y: number;
	options: Options;
}) {
	const tiles = row.map((t, i) => {
		return (
			<BoardTile
				key={i}
				tile={t}
				handleClick={handleClick}
				y={y}
				x={i}
				options={options}
			/>
		);
	});
	return <div className="flex flex-row gap-1">{tiles}</div>;
}

function BoardTile({
	tile,
	handleClick,
	y,
	x,
	options,
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
	options: Options;
}) {
	const leftActive = useRef<boolean>(false);
	const rightActive = useRef<boolean>(false);

	function handleMouseDown(e: React.MouseEvent) {
		if (e.button === 0) {
			leftActive.current = true;
		} else if (e.button === 2) {
			rightActive.current = true;
		}
	}

	function handleMouseUp() {
		if (leftActive.current && rightActive.current) {
			handleClick(tile, y, x, "both");
		} else if (leftActive.current) handleClick(tile, y, x, "left");
		else if (rightActive.current) handleClick(tile, y, x, "right");
		leftActive.current = false;
		rightActive.current = false;
	}

	let content = <></>;
	let style: string =
		"flex select-none cursor-pointer place-items-center justify-center-safe rounded-sm font-mono  font-bold text-(--foreground) shadow-lg shadow-[#0d2a60]/30 text-shadow-lg";

	if (options.heigth >= Size.LARGE) style += " size-5 text-md";
	else if (options.width === Size.EXTRALARGE) style += " size-6 text-md";
	else if (options.heigth === Size.AVERAGE) style += " size-7 text-xl";
	else style += " size-9 text-2xl";

	if (tile.mask === true) {
		content =
			tile.type === "B" ? (
				<IconZap size={27} variant="outline" />
			) : (
				<p>{tile.type}</p>
			);
		style +=
			" border-3! border-(--foreground)! " +
			(tile.type === "B" ? "bg-[#cfd439]" : "bg-transparent");
	} else if (tile.mask === "flag") {
		content = <IconStar size={27} variant="outline" color="#7cc866" />;
		style += " bg-[#e6eff4]";
	} else {
		style += " bg-(--foreground)";
	}

	return (
		<div
			className={style}
			onMouseDown={(e) => handleMouseDown(e)}
			onMouseUp={() => handleMouseUp()}
		>
			{content}
		</div>
	);
}
