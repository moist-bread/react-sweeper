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
import { getTimer, bombCounter, Background } from "./visualInformation";
import { Device, SideButtons, Display } from "./device";
import GameBoard from "./gameBoard";

// !! TO-DO
// -- re-add options menu
// -- restyle the background
// -- re-add the :hover bg-linear for the fish button
// -- add bubbles on WIN

export default function Home() {
	const [options, setOptions] = useState<Options>({
		width: Size.LARGE,
		heigth: Size.AVERAGE,
		difficulty: Difficulty.VERYHARD,
	});

	// console.log("HOME HAS RERENDERED");

	return (
		<div className="flex h-full w-full place-items-center justify-center-safe overflow-hidden bg-(--foreground)">
			<Interface options={options} setOptions={setOptions} />
		</div>
	);
}

function Interface({
	options,
	setOptions,
}: {
	options: Options;
	setOptions: React.Dispatch<React.SetStateAction<Options>>;
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

	//console.log(fieldHistory);

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
		//console.log(fieldHistory);

		setFieldHistory({
			past: null,
			present: fieldHistory.past,
			future: fieldHistory.present,
		});
	});

	const handleRedoField = useEffectEvent(() => {
		if (fieldHistory.future === null) return;
		console.log("REDO");
		//console.log(fieldHistory);

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
		<>
			<Device>
				<SideButtons
					timer={getTimer(gameStatus)}
					bombs={bombCounter(options, fieldHistory.present)}
					options={options}
					setOptions={setOptions}
					handleGameRestart={(o: Options) =>
					setFieldHistory({
						past: null,
						present: Array<Row | null>(o.heigth)
							.fill(null)
							.map((r) =>
								new Array<Tile>(o.width).fill({
									type: "X",
									mask: false,
								}),
							),
						future: null,
					})
				}
				/>
				<Display>
					<GameBoard
						options={options}
						mineField={fieldHistory.present}
						setMineField={handleSetPresentField}
						gameStatus={gameStatus}
					/>
				</Display>
			</Device>
			<Background gameStatus={gameStatus} />
		</>
	);

	/* return (
		<div className="flex h-full w-full flex-col place-items-center justify-center-safe">
			<Background gameStatus={gameStatus} />
			<ResetGame
				handleGameRestart={() =>
					setFieldHistory({
						past: null,
						present: Array<Row | null>(options.heigth)
							.fill(null)
							.map((r) =>
								new Array<Tile>(options.width).fill({
									type: "X",
									mask: false,
								}),
							),
						future: null,
					})
				}
			/>
			<OptionsForm
				options={options}
				setOptions={setOptions}
				handleGameRestart={(o: Options) =>
					setFieldHistory({
						past: null,
						present: Array<Row | null>(o.heigth)
							.fill(null)
							.map((r) =>
								new Array<Tile>(o.width).fill({
									type: "X",
									mask: false,
								}),
							),
						future: null,
					})
				}
			/>
		</div>
	); */
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
