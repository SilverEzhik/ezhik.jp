import { makeInit } from "./lib/init";
import { LuaEngine } from "wasmoon";
import React from "react";
import { LuaApp } from "./lib/lua";

const initialLuaSetup = async (lua: LuaEngine) => {
	await lua.doString(`
		_ = require('pipeline')
	`);
};

function App() {
	return (
		<LuaApp
			initialLuaSetup={initialLuaSetup}
			welcomeMessage={<span>This is a Lua REPL. Type Lua code in the box below and press 'Run'.</span>}
		/>
	);
}

export default makeInit(App);
