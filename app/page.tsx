"use client";
import { useState, useEffect, useEffectEvent } from "react";
import {
	GameStates,
	Tile,
	Row,
	Field,
	History,
	Options,
	Difficulty,
	Size,
} from "./types";
import { checkWinCondition } from "./changeMineField";
import { OptionsForm, ResetGame } from "./options";
import { Timer, BombCounter, Background } from "./visualInformation";
import GameBoard from "./gameBoard";

// !! TO-DO
// -- parallax background that follows the mouse
// -- side menus in the right place

export default function Home() {
	const [gameSeed, setGameSeed] = useState<number>(0);
	const [options, setOptions] = useState<Options>({
		width: Size.LARGE,
		heigth: Size.AVERAGE,
		difficulty: Difficulty.VERYHARD,
	});

	// console.log("HOME HAS RERENDERED");

	return (
		<div>
			<h1 className="font-mono text-4xl font-bold">REACT SWEEPER</h1>
			<h2 className="m-5 font-sans text-xl">the game</h2>
			<Interface
				key={gameSeed}
				options={options}
				setOptions={setOptions}
				handleGameRestart={() => setGameSeed((s) => s + 1)}
			/>
		</div>
	);
}

function Interface({
	options,
	setOptions,
	handleGameRestart,
}: {
	options: Options;
	setOptions: React.Dispatch<React.SetStateAction<Options>>;
	handleGameRestart: () => void;
}) {
	const [fieldHistory, setFieldHistory] = useState<History>({
		past: null,
		present: Array<Row | null>(options.heigth)
			.fill(null)
			.map((r) =>
				new Array<Tile>(options.width).fill({ type: "X", mask: false }),
			),
		future: null,
	});

	console.log(fieldHistory);

	function handleSetPresentField(f: Field) {
		setFieldHistory({
			past: fieldHistory.present,
			present: f,
			future: null,
		});
	}

	const handleUndoField = useEffectEvent(() => {
		if (fieldHistory.past === null) return;
		console.log("UNDO");
		console.log(fieldHistory);

		setFieldHistory({
			past: null,
			present: fieldHistory.past,
			future: fieldHistory.present,
		});
	});

	const handleRedoField = useEffectEvent(() => {
		if (fieldHistory.future === null) return;
		console.log("REDO");
		console.log(fieldHistory);

		setFieldHistory({
			past: fieldHistory.present,
			present: fieldHistory.future,
			future: null,
		});
	});

	const gameStatus: GameStates = detectGameState(fieldHistory.present);
	// console.log("CALCULATED STATE:", gameStatus);

	useEffect(() => {
		let zActive = false;
		let controlActive = false;
		let shiftActive = false;

		function handleUndoDown(event: KeyboardEvent) {
			/* console.log("down", event.key); */
			switch (event.key) {
				case "z":
				case "Z":
					zActive = true;
					break;
				case "Control":
					controlActive = true;
					break;
				case "Shift":
					shiftActive = true;
					break;
				default:
					zActive = false;
					controlActive = false;
					shiftActive = false;
					break;
			}

			if (zActive && controlActive && shiftActive) {
				handleRedoField();
				zActive = false;
				shiftActive = false;
			} else if (zActive && controlActive) {
				handleUndoField();
				zActive = false;
			}
		}

		function handleUndoUp(event: KeyboardEvent) {
			/* console.log("up", event.key); */
			switch (event.key) {
				case "z":
				case "Z":
					zActive = false;
					break;
				case "Control":
					controlActive = false;
					break;
				case "Shift":
					shiftActive = false;
					break;
				default:
					break;
			}
		}
		document.addEventListener("keydown", handleUndoDown);
		document.addEventListener("keyup", handleUndoUp);

		return () => {
			document.removeEventListener("keydown", handleUndoDown);
			document.removeEventListener("keyup", handleUndoUp);
		};
	}, []);

	return (
		<Background gameStatus={gameStatus}>
			<ResetGame handleGameRestart={handleGameRestart} />
			<OptionsForm
				options={options}
				setOptions={setOptions}
				handleGameRestart={handleGameRestart}
			/>
			<Timer status={gameStatus} />
			<BombCounter options={options} mineField={fieldHistory.present} />
			<GameBoard
				options={options}
				mineField={fieldHistory.present}
				setMineField={handleSetPresentField}
				gameStatus={gameStatus}
			/>
		</Background>
	);
}

function detectGameState(mineField: Field): GameStates {
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
