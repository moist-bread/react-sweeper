"use client";
import {
	AeroSurface,
	Gloss,
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardContent,
	Badge,
} from "@frutiger.js/react";
import {
	Button,
	IconFish,
	IconClock,
	IconZap,
	IconLayers,
	IconStar,
} from "@frutiger.js/react";

import { OptionsForm } from "./options";
import { Options } from "./types";

export function Device({ children }: { children: Array<React.JSX.Element> }) {
	return (
		<AeroSurface
			variant="water"
			hasGlossCap={false}
			className="z-1 h-6/7 w-3/4 rounded-[120%_/_30%]! bg-linear-[180deg,#154f9e_0%,#5ba6e0f2_10%,#1d60b7d9_50%,#1054b568_90%,#154f9e_100%]! px-6!"
		>
			<AeroSurface
				variant="chrome"
				hasBevel="deep"
				hasGlossCap={false}
				className="h-full w-full rounded-[20%_/_80%]! border-y-0! bg-linear-[180deg,#9eb5db_0%,#f4faff_8%,#b5cbe9_35%,#618cc5_50%,#799cca_52%,#eff5fc_92%,#79a4d4_100%]! px-8!"
			>
				<AeroSurface
					variant="chrome"
					hasBevel="deep"
					hasGlossCap={false}
					className="h-full w-full rounded-[20%_/_80%]! border-y-0! bg-linear-[180deg,#9eb5db_0%,#ffffff_8%,#e2e8f0_35%,#94a3b8_50%,#cbd5e1_52%,#f8fafc_92%,#79a4d4_100%]! p-10! px-8!"
				>
					<div className="flex h-full w-full flex-row gap-5">
						{children}
					</div>
				</AeroSurface>
			</AeroSurface>
		</AeroSurface>
	);
}

export function SideButtons({
	timer,
	bombs,
	options,
	setOptions,
	handleGameRestart,
}: {
	timer: string;
	bombs: string;
	options: Options;
	setOptions: React.Dispatch<React.SetStateAction<Options>>;
	handleGameRestart: (o: Options) => void;
}) {
	return (
		<>
			<Card variant="floating" className="absolute! left-0! w-sm! hidden!">
				<CardHeader>
					<CardTitle>HELLO</CardTitle>
				</CardHeader>
				<CardContent>
					<OptionsForm
						options={options}
						setOptions={setOptions}
						handleGameRestart={handleGameRestart}
					/>
				</CardContent>
				<CardFooter>
					<Badge
						variant="success"
						icon={<IconLayers size={15} variant="outline" />}
					>
						width / heigth
					</Badge>
				</CardFooter>
			</Card>
			<AeroSurface
				variant="chrome"
				hasBevel="deep"
				hasGlossCap={false}
				className="h-full w-1/5 place-self-center rounded-[90%_40%_40%_90%_/_100%_10%_10%_100%]! bg-linear-[180deg,#e1e8f3_0%,#ffffff_8%,#e2e8f0_35%,#94a3b8_50%,#cbd5e1_52%,#f8fafc_92%,#e1e8f3_100%]! p-3.5! py-5!"
			>
				<div className="flex h-full flex-col justify-between">
					<AeroSurface
						variant="glass"
						hasBevel="deep"
						hasGlossCap={false}
						className="ml-7! flex h-1/6 flex-row place-items-center justify-center-safe gap-2 rounded-[100%_50%_20%_20%_/_200%_100%_40%_40%]! bg-radial-[at_5%_5%]! from-[#4b7fd0]! via-blue-400! to-[#163985]! to-90%! pl-2! font-mono! text-2xl! font-bold shadow-lg shadow-[#0d2a60]/60 text-shadow-lg before:rounded-lg!"
					>
						<Gloss
							intensity="bright"
							color="aurora"
							className="rounded-[5%_25%_50%_50%_/_10%_100%_100%_10%]! opacity-45!"
						/>
						<Gloss
							intensity="bright"
							color="aurora"
							className="h-full! opacity-20!"
						/>
						<IconZap size={25} variant="outline" />
						{bombs}
					</AeroSurface>

					<Button
						variant="aero"
						size="lg"
						leftIcon={<IconLayers size={50} variant="outline" />}
						className="ml-2! h-1/5 rounded-[40%_20%_20%_20%_/_250%_100%_100%_40%]! before:rounded-[12%_/_90%]!"
						onClick={() => handleGameRestart(options)}
					></Button>
					{/* bg-linear-[180deg,#ffffffb3_0%,#ffffff1a_48%,#ffffff_52%,#ffffff4d_100%] */}
					<Button
						variant="aero"
						size="lg"
						leftIcon={<IconFish size={100} variant="outline" />}
						className="h-1/5 rounded-[12%_10%_10%_12%_/_90%_40%_40%_90%]! border-[#508b5f]/50! bg-linear-[180deg,#adf592_0%,#5bbb29_50%,#92ed68_100%]! before:rounded-[12%_/_90%]!"
						onClick={() => handleGameRestart(options)}
					></Button>
					<Button
						variant="aero"
						size="lg"
						leftIcon={<IconStar size={50} variant="outline" />}
						className="ml-2! h-1/5 rounded-[20%_20%_20%_40%_/_40%_100%_100%_250%]! before:rounded-[12%_/_90%]!"
						onClick={() => handleGameRestart(options)}
					></Button>
					<AeroSurface
						variant="glass"
						hasBevel="deep"
						hasGlossCap={false}
						className="ml-7! flex h-1/6 flex-row place-items-center justify-center-safe gap-2 rounded-[20%_20%_50%_100%_/_40%_40%_100%_200%]! bg-radial-[at_5%_5%]! from-[#4b7fd0]! via-blue-400! to-[#163985]! to-90%! pl-2! font-mono! text-xl! font-bold shadow-lg shadow-[#0d2a60]/60 text-shadow-lg before:rounded-lg!"
					>
						<Gloss
							intensity="bright"
							color="aurora"
							className="rounded-[5%_25%_50%_50%_/_10%_100%_100%_10%]! opacity-25!"
						/>
						<IconClock size={25} variant="outline" />
						{timer}
					</AeroSurface>
				</div>
			</AeroSurface>
		</>
	);
}

export function Display({ children }: { children: React.JSX.Element }) {
	return (
		<AeroSurface
			variant="glass"
			hasBevel="deep"
			hasGlossCap={false}
			className="flex h-full w-full place-items-center justify-center-safe rounded-[5%_25%_25%_5%_/_10%_100%_100%_10%]! bg-radial-[at_35%_25%]! from-[#4b7fd0]! via-blue-400! to-[#163985]! to-90%! p-5! pr-15!"
		>
			<Gloss
				intensity="bright"
				color="aurora"
				className="h-1/5! rounded-[5%_25%_50%_50%_/_10%_100%_100%_10%]! opacity-35!"
			/>
			<Gloss
				intensity="bright"
				color="aurora"
				className="rounded-[5%_25%_50%_50%_/_10%_100%_100%_10%]! opacity-20!"
			/>
			{children}
		</AeroSurface>
	);
}
