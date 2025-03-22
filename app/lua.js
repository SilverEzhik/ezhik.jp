import { a as reactExports, j as jsxRuntimeExports, R as React } from "./dependencies/react.js";
import { makeInit } from "./lib/init.js";
import { d as distExports } from "./dependencies/wasmoon.js";
const factory = new distExports.LuaFactory();
await factory.createEngine();
function App() {
  const [luaOutput, setLuaOutput] = reactExports.useState([
    {
      text: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: 'This is a Lua REPL. Type Lua code in the box below and press "Run".' }),
      what: "print"
    }
  ]);
  const [luaInput, setLuaInput] = reactExports.useState("");
  const [lua2, setLua] = reactExports.useState(null);
  function formatLuaValue(lua3, value) {
    const inspect = lua3.global.get("inspect");
    if (typeof value === "string") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "string", children: value });
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "literal", children: JSON.stringify(value) ?? "nil" });
    } else {
      try {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inspect.inspect(value) });
      } catch (e) {
        console.error(e);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: String(value) });
      }
    }
  }
  reactExports.useEffect(() => {
    new distExports.LuaFactory().createEngine({
      enableProxy: false
    }).then(async (lua3) => {
      window.lua = lua3;
      lua3.global.set("print", (...args) => {
        console.log("Lua:", ...args);
        setLuaOutput((luaOutput2) => [
          ...luaOutput2,
          {
            text: args.map((arg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
              formatLuaValue(lua3, arg),
              " "
            ] }, i)),
            what: "print"
          }
        ]);
      });
      lua3.global.set("window", window);
      lua3.global.set("_fetchModuleCode", async (module) => {
        return await fetch(`/app/lua/${module}.lua`).then((r) => {
          if (!r.ok) {
            throw new Error(`Failed to fetch module ${module}`);
          }
          return r.text();
        });
      });
      await lua3.doString(`do
                    local fetchModuleCode = _fetchModuleCode
                    _fetchModuleCode = nil
                    require = function(module)
                        local code = fetchModuleCode(module):await()
                        return load(code)()
                    end
                end`);
      setLua(lua3);
      lua3.doString(`
                    inspect = require('inspect')
                    _ = require('pipeline')
                `);
    });
  }, []);
  const containerRef = reactExports.useRef(null);
  const [inputHistoryIndex, setInputHistoryIndex] = reactExports.useState(-1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: "output-container hljs", children: luaOutput.map(({ text, what }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${what} block`, children: text }, idx)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: async (e) => {
          e.preventDefault();
          setLuaOutput((luaOutput2) => [...luaOutput2, { text: luaInput, what: "input" }]);
          try {
            let output;
            try {
              output = await lua2.doString("return " + luaInput);
            } catch (e2) {
              output = await lua2.doString(luaInput);
            }
            output = formatLuaValue(lua2, output);
            setLuaOutput((luaOutput2) => [...luaOutput2, { text: output, what: "output" }]);
          } catch (e2) {
            setLuaOutput((luaOutput2) => [...luaOutput2, { text: e2.message, what: "error" }]);
          }
          setLuaInput("");
          setInputHistoryIndex(-1);
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
          }, 0);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: luaInput,
              onChange: (e) => setLuaInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const direction = e.key === "ArrowUp" ? -1 : 1;
                  const idx = inputHistoryIndex + direction;
                  setInputHistoryIndex(idx);
                  const inputHistory = [...luaOutput.filter((o) => o.what === "input").map((o) => o.text), ""];
                  const entry = inputHistory.at(idx % inputHistory.length);
                  setLuaInput(entry ?? "");
                }
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", children: "Run" })
        ]
      }
    )
  ] });
}
const lua = makeInit(App);
export {
  lua as default
};
//# sourceMappingURL=lua.js.map
