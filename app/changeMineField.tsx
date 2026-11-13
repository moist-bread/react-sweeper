"use client";
import { TileType, Row } from "./types";

export function generateMineField(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	let tempField: Array<Row> = mineField.slice();
	/* console.log("force empty area at ", y, x); */

	const totalBombs: number = Math.floor((width * heigth) / 5); // !! change the 5 based on difficulty

	for (let placedBombs = 0; placedBombs < totalBombs;) {
		let bombY = Math.floor(Math.random() * heigth);
		let bombX = Math.floor(Math.random() * width);
		if (
			tempField[bombY][bombX].type !== "B" &&
			(bombY > y + 1 || bombY < y - 1 || bombX > x + 1 || bombX < x - 1)
		) {
			tempField[bombY][bombX] = { type: "B", mask: false };
			placedBombs++;
			/* console.log("placing bomb ", placedBombs, " on ", bombY, bombX); */
		}
	}

	tempField.forEach((row, y, field) => {
		row.forEach((tile, x) => {
			if (tile.type === "B") return;

			let bombsAround: number = 0;

			const limitTop = Math.max(y - 1, 0);
			const limitBottom = Math.min(y + 2, heigth);
			for (let r = limitTop; r < limitBottom; r++) {
				const limitLeft = Math.max(x - 1, 0);
				const limitRight = Math.min(x + 2, width);
				for (let c = limitLeft; c < limitRight; c++)
					bombsAround += field[r][c].type === "B" ? 1 : 0;
			}

			if (bombsAround !== 0)
				field[y][x] = { type: bombsAround as TileType, mask: false };
		});
	});

	return tempField;
}

export function floodMaskField(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	let tempField: Array<Row> = mineField.slice();
	floodFill(tempField, width, heigth, y, x);
	return tempField;
}

function floodFill(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	if (
		y < 0 ||
		y >= heigth ||
		x < 0 ||
		x >= width ||
		mineField[y][x].mask === true ||
		mineField[y][x].mask === "flag"
	)
		return;

	mineField[y][x] = { ...mineField[y][x], mask: true };
	if (mineField[y][x].type !== " ") return;

	floodFill(mineField, width, heigth, y - 1, x - 1);
	floodFill(mineField, width, heigth, y - 1, x);
	floodFill(mineField, width, heigth, y - 1, x + 1);
	floodFill(mineField, width, heigth, y, x - 1);
	floodFill(mineField, width, heigth, y, x + 1);
	floodFill(mineField, width, heigth, y + 1, x - 1);
	floodFill(mineField, width, heigth, y + 1, x);
	floodFill(mineField, width, heigth, y + 1, x + 1);
}
