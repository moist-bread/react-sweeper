"use client";
import { Options, Size, Difficulty } from "./types";

export function ResetGame({
	handleGameRestart,
}: {
	handleGameRestart: () => void;
}) {
	return (
		<button
			className="m-2 cursor-pointer bg-(--accent) p-2 font-bold"
			onClick={() => handleGameRestart()}
		>
			RESET
		</button>
	);
}

export function OptionsForm({
	options,
	setOptions,
	handleGameRestart,
}: {
	options: Options;
	setOptions: React.Dispatch<React.SetStateAction<Options>>;
	handleGameRestart: (o: Options) => void;
}) {
	return (
		<form
			className="flex flex-col gap-5"
			method="post"
			onSubmit={(e: React.SubmitEvent) => {
				e.preventDefault();
				const newOptions: Options = {
					width: parseInt(e.target.width.value),
					heigth: parseInt(e.target.heigth.value),
					difficulty: parseInt(e.target.difficulty.value),
				};
				setOptions(newOptions);
				handleGameRestart(newOptions);
			}}
		>
			<div className="flex flex-row gap-5">
				<label className="flex flex-col">
					HEIGTH:
					<select
						defaultValue={options.heigth}
						id="heigth"
						name="heigth"
						className="w-xs cursor-pointer border px-2 py-1"
						required
					>
						<option value={Size.EXTRASMALL}>
							{Size.EXTRASMALL}
						</option>
						<option value={Size.SMALL}>{Size.SMALL}</option>
						<option value={Size.AVERAGE}>{Size.AVERAGE}</option>
						<option value={Size.LARGE}>{Size.LARGE}</option>
					</select>
				</label>
			</div>
			<div className="flex flex-row gap-5">
				<label className="flex flex-col">
					WIDTH:
					<select
						defaultValue={options.width}
						id="width"
						name="width"
						className="w-xs cursor-pointer border px-2 py-1"
						required
					>
						<option value={Size.EXTRASMALL}>
							{Size.EXTRASMALL}
						</option>
						<option value={Size.SMALL}>{Size.SMALL}</option>
						<option value={Size.AVERAGE}>{Size.AVERAGE}</option>
						<option value={Size.LARGE}>{Size.LARGE}</option>
						<option value={Size.EXTRALARGE}>
							{Size.EXTRALARGE}
						</option>
					</select>
				</label>
			</div>

			<div className="flex flex-row gap-5">
				<label className="flex flex-col">
					DIFFICULTY:
					<select
						defaultValue={options.difficulty}
						id="difficulty"
						name="difficulty"
						className="w-xs cursor-pointer border px-2 py-1"
						required
					>
						<option value={Difficulty.VERYEASY}>VERY EASY</option>
						<option value={Difficulty.EASY}>EASY</option>
						<option value={Difficulty.MEDIUM}>MEDIUM</option>
						<option value={Difficulty.HARD}>HARD</option>
						<option value={Difficulty.VERYHARD}>VERY HARD</option>
					</select>
				</label>
			</div>

			<div>
				<button
					className="mt-5 rounded-lg border bg-(--highlight) px-4 py-1 font-bold hover:cursor-pointer"
					type="submit"
				>
					SUBMIT
				</button>
			</div>
		</form>
	);
}
