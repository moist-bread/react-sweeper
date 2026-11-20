"use client";
import {
	AeroSurface,
	Glass,
	Gloss,
	Bevel,
	Glow,
	Reflection,
} from "@frutiger.js/react";
import { Button, IconFish, IconClock, IconZap } from "@frutiger.js/react";

export function SideButtons({
	timer,
	bombs,
	handleGameRestart,
}: {
	timer: string;
	bombs: string;
	handleGameRestart: () => void;
}) {
	return (
		<AeroSurface
			variant="chrome"
			hasBevel="deep"
			hasGlossCap={false}
			className="h-1/2 w-1/5 place-self-center rounded-[100%_/_100%]! p-4!"
		>
			<div className="flex h-full flex-col place-content-center gap-1">
				<Button
					variant="aero"
					size="lg"
					leftIcon={<IconClock size={30} variant="outline" />}
					className="z-10! mx-3! rounded-[50%_50%_5%_5%_/_100%_100%_10%_10%]! py-5! font-mono! text-3xl!"
				>
					{timer}
				</Button>
				<Button
					variant="aero"
					size="lg"
					leftIcon={<IconFish size={100} variant="outline" />}
					className="z-10! rounded-[12%_/_90%]! p-0! before:rounded-[12%_/_90%]!"
					onClick={handleGameRestart}
				></Button>
				<Button
					variant="aero"
					size="lg"
					leftIcon={<IconZap size={30} variant="outline" />}
					className="z-10! mx-3! rounded-[5%_5%_50%_50%_/_10%_10%_100%_100%]! py-5! font-mono! text-3xl! before:rounded-lg!"
				>
					{bombs}
				</Button>
			</div>
		</AeroSurface>
	);
}

export function Display({ children }: { children: React.JSX.Element }) {
	return (
		<AeroSurface
			variant="glass"
			hasBevel="deep"
			hasGlossCap={false}
			className="z-1! mr-5! flex h-full w-full place-items-center justify-center-safe rounded-[5%_25%_25%_5%_/_10%_100%_100%_10%]! bg-radial-[at_35%_25%]! from-[#4b7fd0]! via-blue-400! to-[#163985]! to-90%! p-5! pr-15!"
		>
			<Gloss
				intensity="bright"
				color="aurora"
				className="h-1/5! rounded-[5%_25%_50%_50%_/_10%_100%_100%_10%]! opacity-50!"
			/>
			<Gloss
				intensity="bright"
				color="aurora"
				className="rounded-[5%_25%_50%_50%_/_10%_100%_100%_10%]! opacity-25!"
			/>
			{children}
		</AeroSurface>
	);
}

export function Device({ children }: { children: React.JSX.Element }) {
	// small device
	/* <AeroSurface
		variant="chrome"
		hasBevel="deep"
		glow="meadow"
		className="h-full w-full rounded-[20%_50%_/_60%]!"
	></AeroSurface> */

	// concave div
	/* <div className="fixed size-70 overflow-hidden rounded-4xl">
	<div className="absolute size-100 rounded-full shadow-[-20vmin_-20vmin_#c00]"></div>
	</div>

	<div className="fixed size-50 overflow-hidden translate-x-100">
		<div className="absolute size-100 rounded-full bg-red-500"></div>
	</div> */

	return (
		<AeroSurface
			variant="water"
			hasGlossCap={false}
			className="z-1 h-6/7 w-3/4 rounded-4xl! px-6!"
		>
			<AeroSurface
				variant="chrome"
				hasBevel="deep"
				hasGlossCap={false}
				className="h-full w-full rounded-[20%_/_80%]! p-6!"
			>
				<AeroSurface
					variant="chrome"
					hasBevel="deep"
					hasGlossCap={false}
					className="h-full w-full rounded-[30%_/_80%]! p-12! pl-8!"
				>
					{children}
				</AeroSurface>
			</AeroSurface>
		</AeroSurface>
	);
}
