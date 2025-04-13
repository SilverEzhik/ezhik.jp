import { JSX, useEffect, useRef, useState } from "react";
import { makeInit } from "./lib/init";
import { LuaEngine, LuaFactory } from "wasmoon";
import React from "react";
import { LuaApp } from "./lib/lua";

const initialLuaSetup = async (lua: LuaEngine) => {
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
	return (
		<LuaApp
			initialLuaSetup={initialLuaSetup}
			welcomeMessage={
				<>
					<p>This is a Lua REPL. Type Lua code in the box below and press 'Run'.</p>
					<p>
						This REPL includes <b>f-strings</b> as described below, allowing for quick string interpolation and
						formatting.
					</p>
					<p>Example:</p>
					<b>
						<code>{example}</code>
					</b>
				</>
			}
		/>
	);
}

export default makeInit(App);
