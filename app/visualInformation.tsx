"use client";
import { useState, useRef } from "react";
import { GameStates, Row, Options } from "./types";

export function Background({
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

export function Timer({ status }: { status: GameStates }) {
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
		}, 1000);
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

export function BombCounter({
	options,
	mineField,
}: {
	options: Options;
	mineField: Array<Row>;
}) {
	const flaggedTiles: number = mineField.reduce(
		(total, row) =>
			total +
			row.reduce(
				(total, t) => (t.mask === "flag" ? total + 1 : total),
				0,
			),
		0,
	);
	const counter: number =
		Math.floor((options.width * options.heigth) / options.difficulty) -
		flaggedTiles;
	return (
		<div className="m-2 bg-(--accent) p-2 font-bold">
			{counter < 100 ? "0" : ""}
			{counter < 10 ? "0" : ""}
			{counter}
		</div>
	);
}
