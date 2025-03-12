import { makeInit } from "../lib/init";
import { useCallback, useEffect, useRef, useState } from "react";

const xNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const cellIds: string[] = [];
for (let y = 1; y <= 10; y++) {
	for (const x of xNames.slice(0, 10)) {
		cellIds.push(`${x}${y}`);
	}
}
const startCells = Object.fromEntries(cellIds.map((id) => [id, ""]));
startCells.A1 = "1";
startCells.B1 = "2";
startCells.C1 = "A1 + B1";

const AsyncFunction = async function () {}.constructor;

function useSheetNaiveAf() {
	const [sheet, setSheet] = useState(startCells);

	const cellUpdaterFactory = useCallback(
		(id: string) => {
			return (v: string) => {
				setSheet({
					...sheet,
					[id]: v,
				});
			};
		},
		[sheet],
	);

	const [computedSheet, setComputedSheet] = useState(null);
	useEffect(() => {
		const computers = {};
		const computingComputers = {};
		for (let [it, code] of Object.entries(sheet)) {
			if (code.trim() === "") {
				continue;
			}
			for (const cellId of cellIds) {
				code = code.replace(cellId, `(await (cc.${cellId} ??= c.${cellId}(c, cc)))`);
			}
			console.log(it, code);
			try {
				computers[it] = new AsyncFunction("c", "cc", `try { return ${code} } catch (e) { return NaN }`);
			} catch (e) {
				computers[it] = async () => NaN;
			}
		}
		Promise.all(
			Object.entries(computers).map(async ([id, computer]) => [
				id,
				await (computingComputers[id] ??= computer(computers, computingComputers)),
			]),
		).then((values) => {
			const coolSheet = Object.fromEntries(values);
			setComputedSheet(coolSheet);
			console.log("we computed this:", coolSheet);
		});
	}, [sheet]);

	return {
		sheet,
		computedSheet,
		cellUpdaterFactory,
	};
}

interface CellProps {
	id: string;
	sheet: Record<string, string>;
	computedSheet?: Record<string, unknown>;
	setValue: (v: string) => void;
}
function Cell({ id, sheet, computedSheet, setValue }: CellProps) {
	const value = sheet[id];
	let computedValue;
	if (!computedSheet) {
		computedValue = "...";
	} else {
		const cv = computedSheet[id];
		if (cv === undefined) {
			computedValue = "";
		} else if (cv !== cv) {
			computedValue = "NaN";
		} else {
			computedValue = JSON.stringify(computedSheet[id]);
		}
	}
	// const inputRef = useRef<HTMLInputElement>(null);
	const [hasFocus, setHasFocus] = useState(false);

	const valueToShow = hasFocus ? value : computedValue;

	return (
		<input
			id={id}
			title={id}
			className="cell"
			onKeyUp={(e) => {
				if (e.key === "Enter") {
					const cellBelow = id[0] + (parseInt(id.slice(1)) + 1);
					const cellAbove = id[0] + (parseInt(id.slice(1)) - 1);
					const cell = e.shiftKey ? cellAbove : cellBelow;
					// this is not react-like at all lol
					document.querySelector(`#${cell}`)?.focus();
				}
			}}
			onChange={(e) => {
				setValue(e.target.value);
			}}
			value={valueToShow}
			onFocus={() => setHasFocus(true)}
			onBlur={() => setHasFocus(false)}
		/>
	);
}

function Spreadsheet() {
	const { sheet, computedSheet, cellUpdaterFactory } = useSheetNaiveAf();
	const cellNodes = cellIds.map((id) => (
		<Cell
			id={id}
			key={id}
			sheet={sheet}
			computedSheet={computedSheet}
			setValue={useCallback(cellUpdaterFactory(id), [id, sheet])}
		/>
	));
	return (
		<div className="container">
			<div className="spreadsheet">{cellNodes}</div>
		</div>
	);
}

export default makeInit(Spreadsheet);
