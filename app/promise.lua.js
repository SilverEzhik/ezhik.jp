import { j as jsxRuntimeExports } from "./dependencies/react.js";
import { makeInit } from "./lib/init.js";
import { LuaApp } from "./lib/lua.js";
const initialLuaSetup = async (lua) => {
  for (const verb of ["set", "clear"]) {
    for (const name of ["Interval", "Timeout"]) {
      const id = `${verb}${name}`;
      lua.global.set(id, window[id]);
    }
  }
  await lua.doString(`
		_ = require('pipeline')
		Promise = require('Promise')

		Promise.schedule = function(fn)
			setTimeout(fn, 0)
		end
	`);
};
const example = `Promise.new(function(r) setTimeout(r, 1000) end)
	:next(function(v) print("Resolved") end)`;
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    LuaApp,
    {
      initialLuaSetup,
      welcomeMessage: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This is a Lua REPL. Type Lua code in the box below and press 'Run'." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "This REPL includes the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Promise" }),
          " class described below, along with JavaScript's ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "setTimeout" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "setInterval" }),
          ", ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "clearTimeout" }),
          ", and ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "clearInterval" }),
          " functions."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Example:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: example }) })
      ] })
    }
  );
}
const promise_lua = makeInit(App);
export {
  promise_lua as default
};
//# sourceMappingURL=promise.lua.js.map
