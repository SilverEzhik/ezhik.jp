import { j as jsxRuntimeExports } from "./dependencies/react.js";
import { makeInit } from "./lib/init.js";
import { LuaApp } from "./lib/lua.js";
const initialLuaSetup = async (lua2) => {
  await lua2.doString(`
		_ = require('pipeline')
	`);
};
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    LuaApp,
    {
      initialLuaSetup,
      welcomeMessage: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This is a Lua REPL. Type Lua code in the box below and press 'Run'." })
    }
  );
}
const lua = makeInit(App);
export {
  lua as default
};
//# sourceMappingURL=lua.js.map
