import { makeInit } from "../lib/init";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuaEngine, LuaFactory } from "wasmoon";

const xNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const props = ["", "_fontWeight", "_fontFamily", "_bgColor", "_fgColor"];
const cellIds: string[] = [];
for (let y = 1; y <= 10; y++) {
	for (const x of xNames.slice(0, 10)) {
		for (const prop of props) {
			cellIds.push(`${x}${y}${prop}`);
		}
	}
}
const startCells = Object.fromEntries(cellIds.map((id) => [id, ""]));
startCells.A1 = "1";
startCells.B1 = "2";
startCells.C1 = "A1 + B1";

startCells.C1_fontWeight = "F4";
startCells.C1_fontFamily = "F5";
startCells.C1_bgColor = "F6";
startCells.C1_fgColor = "F7";

startCells.E4 = `"Font weight:"`;
startCells.E4_fontWeight = `"bold"`;
startCells.F4 = `"bold"`;

startCells.E5 = `"Font family:"`;
startCells.E5_fontWeight = `"bold"`;
startCells.F5 = `"monospace"`;

startCells.E6 = `"BG color:"`;
startCells.E6_fontWeight = `"bold"`;
startCells.F6 = `"blue"`;

startCells.E7 = `"FG color:"`;
startCells.E7_fontWeight = `"bold"`;
startCells.F7 = `"white"`;

const AsyncFunction = async function () {}.constructor;

const luaFactory = new LuaFactory();
async function getLua() {
	return await luaFactory.createEngine({ enableProxy: false });
}

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
		const computers: Record<string, () => Promise<unknown>> = {};
		const computingComputers: Record<string, Promise<unknown>> = {};
		for (const [it, code] of Object.entries(sheet)) {
			computers[it] = async () => {
				// is making a new lua engine every time wise? probably not.
				const lua = await getLua();
				lua.global.set("_getCell", async (id) => {
					if (computers[id]) {
						computingComputers[id] ??= computers[id]();
						return await computingComputers[id];
					} else {
						return null;
					}
				});
				await lua.doString(`
					do
						local getCell = _getCell
						_getCell = nil
						setmetatable(_G, {
							__index = function(_, key)
								return getCell(key):await()
							end
						})
						print(_G)
					end
				`);
				return await lua.doString(`return ${code}`);
			};
		}
		Promise.all(
			Object.entries(computers).map(async ([id, computer]) => [id, await (computingComputers[id] ??= computer())]),
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
	setCurrentCell: (id: string) => void;
}
function Cell({ id, sheet, computedSheet, setValue, setCurrentCell }: CellProps) {
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
		} else if (typeof cv === "string") {
			computedValue = cv;
		} else {
			computedValue = JSON.stringify(computedSheet[id]);
		}
	}
	const propIds = props.map((prop) => `${id}${prop}`);
	const [_unneeded, fontWeight, fontFamily, bgColor, fgColor] = propIds.map((propId) => computedSheet?.[propId]);

	// const inputRef = useRef<HTMLInputElement>(null);
	const [hasFocus, setHasFocus] = useState(false);

	const valueToShow = hasFocus ? value : computedValue;

	return (
		<input
			id={id}
			title={id}
			className={"cell" + (hasFocus ? " has-focus" : "")}
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
			onFocus={() => {
				setHasFocus(true);
				setCurrentCell(id);
			}}
			onBlur={() => setHasFocus(false)}
			style={{
				fontWeight: fontWeight as string,
				fontFamily: fontFamily as string,
				backgroundColor: bgColor as string,
				color: fgColor as string,
			}}
		/>
	);
}

function CellConfig({ id, sheet, cellUpdaterFactory }) {
	const propIds = props.map((prop) => `${id}${prop}`);

	const propConfs = [];
	for (const propId of propIds) {
		const value = sheet[propId];
		const setValue = useCallback(cellUpdaterFactory(propId), [propId, sheet]);
		const el = (
			<div className="prop" key={propId}>
				<label htmlFor={propId}>{propId}</label>
				<input id={propId} value={value} onChange={(e) => setValue(e.target.value)} />
			</div>
		);
		propConfs.push(el);
	}

	return <div className="cell-config">{propConfs}</div>;
}

function Spreadsheet() {
	const { sheet, computedSheet, cellUpdaterFactory } = useSheetNaiveAf();
	const [currentCell, setCurrentCell] = useState("A1");
	const cellNodes = cellIds
		.filter((id) => !id.includes("_"))
		.map((id) => (
			<Cell
				id={id}
				key={id}
				sheet={sheet}
				computedSheet={computedSheet}
				setValue={useCallback(cellUpdaterFactory(id), [id, sheet])}
				setCurrentCell={setCurrentCell}
			/>
		));
	return (
		<div className="container">
			<div className="spreadsheet">{cellNodes}</div>
			<CellConfig id={currentCell} sheet={sheet} cellUpdaterFactory={cellUpdaterFactory} />
		</div>
	);
}

export default makeInit(Spreadsheet);
