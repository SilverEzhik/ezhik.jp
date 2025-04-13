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
		
		f = require('f-string')
	`);
};
const example = `local who = "hedgehogs"; print(f"Hello {who}! Check this out: '{1 + 2 = }'")`;
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    LuaApp,
    {
      initialLuaSetup,
      welcomeMessage: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This is a Lua REPL. Type Lua code in the box below and press 'Run'." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "This REPL includes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "f-strings" }),
          " as described below, allowing for quick string interpolation and formatting."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Example:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: example }) })
      ] })
    }
  );
}
const fString_lua = makeInit(App);
export {
  fString_lua as default
};
//# sourceMappingURL=f-string.lua.js.map
