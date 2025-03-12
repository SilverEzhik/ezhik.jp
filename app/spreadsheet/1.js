import { j as jsxRuntimeExports, a as reactExports } from "../dependencies/react.js";
import { makeInit } from "../lib/init.js";
const xNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cellIds = [];
for (let y = 1; y <= 10; y++) {
  for (const x of xNames.slice(0, 10)) {
    cellIds.push(`${x}${y}`);
  }
}
const startCells = Object.fromEntries(cellIds.map((id) => [id, ""]));
startCells.A1 = "1";
startCells.B1 = "2";
startCells.C1 = "A1 + B1";
const AsyncFunction = (async function() {
}).constructor;
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
        await (computingComputers[id] ?? (computingComputers[id] = computer(computers, computingComputers)))
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
function Cell({ id, sheet, computedSheet, setValue }) {
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
    } else {
      computedValue = JSON.stringify(computedSheet[id]);
    }
  }
  const [hasFocus, setHasFocus] = reactExports.useState(false);
  const valueToShow = hasFocus ? value : computedValue;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      id,
      title: id,
      className: "cell",
      onKeyUp: (e) => {
        var _a;
        if (e.key === "Enter") {
          const cellBelow = id[0] + (parseInt(id.slice(1)) + 1);
          const cellAbove = id[0] + (parseInt(id.slice(1)) - 1);
          const cell = e.shiftKey ? cellAbove : cellBelow;
          (_a = document.querySelector(`#${cell}`)) == null ? void 0 : _a.focus();
        }
      },
      onChange: (e) => {
        setValue(e.target.value);
      },
      value: valueToShow,
      onFocus: () => setHasFocus(true),
      onBlur: () => setHasFocus(false)
    }
  );
}
function Spreadsheet() {
  const { sheet, computedSheet, cellUpdaterFactory } = useSheetNaiveAf();
  const cellNodes = cellIds.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cell,
    {
      id,
      sheet,
      computedSheet,
      setValue: reactExports.useCallback(cellUpdaterFactory(id), [id, sheet])
    },
    id
  ));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spreadsheet", children: cellNodes }) });
}
const _1 = makeInit(Spreadsheet);
export {
  _1 as default
};
//# sourceMappingURL=1.js.map
