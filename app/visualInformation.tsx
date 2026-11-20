"use client";
import { useState, useRef, useEffect } from "react";
import { GameStates, Row, Options } from "./types";
import { GrassField } from "@frutiger.js/react";

export function Background({ gameStatus }: { gameStatus: GameStates }) {
	let color;
	switch (gameStatus) {
		case "lose":
			color = "accent";
			break;
		case "win":
			color = "highlight";
			break;
		default:
			color = "sky";
	}

	const pos = usePointerPosition();
	return (
		<div
			className="absolute top-0 left-0 flex h-dvh w-full justify-center overflow-hidden bg-sky-800"
			style={{ background: `var(--${color})` }}
		>
			<div
				className="absolute bottom-4/5 h-full w-full bg-sky-100/50"
				style={{ transform: `translate(${0}px, -${pos.y / 18}px)` }}
			/>
			<div
				className="absolute top-1/2 h-full w-full bg-green-500/50"
				style={{ transform: `translate(${0}px, -${pos.y / 8}px)` }}
			/>
			<div
				className="absolute top-2/3 h-full w-full bg-green-500/50"
				style={{ transform: `translate(${0}px, -${pos.y / 10}px)` }}
			/>
			<div
				className="absolute top-3/4 h-full w-full bg-green-500/50"
				style={{ transform: `translate(${0}px, -${pos.y / 15}px)` }}
			/>
			<div
				className="absolute bottom-0 left-0 h-0 w-0 border-x-125 border-b-150 border-solid border-x-transparent border-b-green-700/50"
				style={{ transform: `translate(-${pos.x / 18}px, ${0}px)` }}
			/>
			<div
				className="absolute bottom-0 h-0 w-0 border-x-125 border-b-150 border-solid border-x-transparent border-b-green-700/50"
				style={{ transform: `translate(-${pos.x / 25}px, ${0}px)` }}
			/>
			<div
				className="absolute right-0 bottom-0 h-0 w-0 border-x-125 border-b-150 border-solid border-x-transparent border-b-green-700/50"
				style={{ transform: `translate(-${pos.x / 18}px, ${0}px)` }}
			/>
			<GrassField showFlowers={false} showDew={false} colorScheme="sunny" density="low"  className="absolute! bottom-0!" />
		</div>
	);
}

function usePointerPosition() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	useEffect(() => {
		function handleMove(e: PointerEvent) {
			setTimeout(() => setPosition({ x: e.clientX, y: e.clientY }), 100);
		}
		window.addEventListener("pointermove", handleMove);
		return () => window.removeEventListener("pointermove", handleMove);
	}, []);
	return position;
}

export function getTimer(status: GameStates) {
	const [seconds, setSeconds] = useState<number>(0);

	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
	if (seconds !== 0 && status === "before") {
		setSeconds(0);
	}
	if (timerIntervalRef.current !== null && status !== "during") {
		clearInterval(timerIntervalRef.current);
		timerIntervalRef.current = null;
	} else if (timerIntervalRef.current === null && status === "during") {
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

	const mins = Math.floor(seconds / 60);
	const secs = seconds - mins * 60;

	return (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
}

export function bombCounter(options: Options, mineField: Array<Row>) {
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
	return (counter < 100 ? "0" : "") + (counter < 10 ? "0" : "") + counter;
}
