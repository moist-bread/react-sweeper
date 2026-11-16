"use client";
import { TileType, Tile, Row } from "./types";

export function generateMineField(
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	let tempField: Array<Row> = Array<Row | null>(heigth)
		.fill(null)
		.map((r) => new Array<Tile>(width).fill({ type: " ", mask: false }));
	/* console.log("force empty area at ", y, x); */

	if (width <= 3 && heigth <= 3) return tempField;

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

export function toggleFlagAt(mineField: Array<Row>, y: number, x: number) {
	let tempField: Array<Row> = mineField.slice();

	if (tempField[y][x].mask === false) {
		console.log("SET FLAG AT", y, x);
	} else if (tempField[y][x].mask === "flag") {
		console.log("REMOVE FLAG AT", y, x);
	}

	tempField[y][x] = {
		...tempField[y][x],
		mask: tempField[y][x].mask === false ? "flag" : false,
	};

	return tempField;
}

export function exposeNeighours(
	mineField: Array<Row>,
	width: number,
	heigth: number,
	y: number,
	x: number,
) {
	const limitTop = Math.max(y - 1, 0);
	const limitBottom = Math.min(y + 2, heigth);
	const limitLeft = Math.max(x - 1, 0);
	const limitRight = Math.min(x + 2, width);

	let flagCount: number = 0;
	let hiddenTiles: number = 0;

	for (let r = limitTop; r < limitBottom; r++)
		for (let c = limitLeft; c < limitRight; c++) {
			if (mineField[r][c].mask === "flag") flagCount++;
			if (mineField[r][c].mask === false) hiddenTiles++;
		}

	if (flagCount !== mineField[y][x].type || hiddenTiles === 0) {
		console.log("stays the same...");
		return mineField;
	}

	let tempField: Array<Row> = mineField.slice();

	floodFill(tempField, width, heigth, y - 1, x - 1);
	floodFill(tempField, width, heigth, y - 1, x);
	floodFill(tempField, width, heigth, y - 1, x + 1);
	floodFill(tempField, width, heigth, y, x - 1);
	floodFill(tempField, width, heigth, y, x + 1);
	floodFill(tempField, width, heigth, y + 1, x - 1);
	floodFill(tempField, width, heigth, y + 1, x);
	floodFill(tempField, width, heigth, y + 1, x + 1);

	return tempField;
}

export function checkWinCondition(mineField: Array<Row>) {
	// all non bomb spaces are mask true
	console.log("CHECKING WIN...");
	console.log(mineField);
	for (let idx_row = 0; idx_row < mineField.length; idx_row++) {
		const row = mineField[idx_row];
		for (let idx_tile = 0; idx_tile < row.length; idx_tile++) {
			const tile = row[idx_tile];
			if (tile.type !== "B" && tile.mask !== true) {
				console.log(
					"failed because of",
					tile.type,
					"at",
					idx_row,
					idx_tile,
				);
				return false;
			}
		}
	}

	// !! could do a for loop so i can return in the middle
	console.log("WON!");

	return true;
}
