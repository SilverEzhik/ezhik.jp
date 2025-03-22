import { a as reactExports, j as jsxRuntimeExports } from "../dependencies/react.js";
import { makeInit } from "../lib/init.js";
const xNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const props = ["", "_fontWeight", "_fontFamily", "_bgColor", "_fgColor"];
const cellIds = [];
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
const AsyncFunction = async function() {
}.constructor;
function useSheetNaiveAf() {
  const [sheet, setSheet] = reactExports.useState(startCells);
  const cellUpdaterFactory = reactExports.useCallback(
    (id) => {
      return (v) => {
        setSheet({
          ...sheet,
          [id]: v
        });
      };
    },
    [sheet]
  );
  const [computedSheet, setComputedSheet] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
        await (computingComputers[id] ??= computer(computers, computingComputers))
      ])
    ).then((values) => {
      const coolSheet = Object.fromEntries(values);
      setComputedSheet(coolSheet);
      console.log("we computed this:", coolSheet);
    });
  }, [sheet]);
  return {
    sheet,
    computedSheet,
    cellUpdaterFactory
  };
}
function Cell({ id, sheet, computedSheet, setValue, setCurrentCell }) {
  const value = sheet[id];
  let computedValue;
  if (!computedSheet) {
    computedValue = "...";
  } else {
    const cv = computedSheet[id];
    if (cv === void 0) {
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
  const [hasFocus, setHasFocus] = reactExports.useState(false);
  const valueToShow = hasFocus ? value : computedValue;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      id,
      title: id,
      className: "cell" + (hasFocus ? " has-focus" : ""),
      onKeyUp: (e) => {
        if (e.key === "Enter") {
          const cellBelow = id[0] + (parseInt(id.slice(1)) + 1);
          const cellAbove = id[0] + (parseInt(id.slice(1)) - 1);
          const cell = e.shiftKey ? cellAbove : cellBelow;
          document.querySelector(`#${cell}`)?.focus();
        }
      },
      onChange: (e) => {
        setValue(e.target.value);
      },
      value: valueToShow,
      onFocus: () => {
        setHasFocus(true);
        setCurrentCell(id);
      },
      onBlur: () => setHasFocus(false),
      style: {
        fontWeight,
        fontFamily,
        backgroundColor: bgColor,
        color: fgColor
      }
    }
  );
}
function CellConfig({ id, sheet, cellUpdaterFactory }) {
  const propIds = props.map((prop) => `${id}${prop}`);
  const propConfs = [];
  for (const propId of propIds) {
    const value = sheet[propId];
    const setValue = reactExports.useCallback(cellUpdaterFactory(propId), [propId, sheet]);
    const el = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prop", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: propId, children: propId }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: propId, value, onChange: (e) => setValue(e.target.value) })
    ] }, propId);
    propConfs.push(el);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cell-config", children: propConfs });
}
function Spreadsheet() {
  const { sheet, computedSheet, cellUpdaterFactory } = useSheetNaiveAf();
  const [currentCell, setCurrentCell] = reactExports.useState("A1");
  const cellNodes = cellIds.filter((id) => !id.includes("_")).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cell,
    {
      id,
      sheet,
      computedSheet,
      setValue: reactExports.useCallback(cellUpdaterFactory(id), [id, sheet]),
      setCurrentCell
    },
    id
  ));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spreadsheet", children: cellNodes }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CellConfig, { id: currentCell, sheet, cellUpdaterFactory })
  ] });
}
const _2 = makeInit(Spreadsheet);
export {
  _2 as default
};
//# sourceMappingURL=2.js.map
