import { JSX, useEffect, useRef, useState } from "react";
import { makeInit } from "./lib/init";
import { LuaEngine, LuaFactory } from "wasmoon";
import React from "react";
import { sleep } from "./lib/userscript";

const factory = new LuaFactory();
const lua = await factory.createEngine();

// wasmoon wants to have a lua thing
// window.setImmediate = (fn) => setTimeout(fn, 0);

interface LuaOutput {
	text: string | JSX.Element | JSX.Element[];
	what: "input" | "output" | "error" | "print";
}

function App() {
	const [luaOutput, setLuaOutput] = useState<LuaOutput[]>([
		{
			text: <span>This is a Lua REPL. Type Lua code in the box below and press "Run".</span>,
			what: "print",
		},
	]);
	const [luaInput, setLuaInput] = useState("");

	const [lua, setLua] = useState<LuaEngine | null>(null);

	function formatLuaValue(lua, value: unknown): JSX.Element {
		const inspect = lua.global.get("inspect");
		// console.log(inspect);
		if (typeof value === "string") {
			return <span className="string">{value}</span>;
		} else if (typeof value === "number" || typeof value === "boolean" || value == null) {
			return <span className="literal">{JSON.stringify(value) ?? "nil"}</span>;
		} else {
			try {
				return <span>{inspect.inspect(value)}</span>;
			} catch (e) {
				console.error(e);
				return <span>{String(value)}</span>;
			}
		}
	}

	useEffect(() => {
		new LuaFactory()
			.createEngine({
				enableProxy: false,
			})
			.then(async (lua) => {
				window.lua = lua;

				lua.global.set("print", (...args: unknown[]) => {
					console.log("Lua:", ...args);
					setLuaOutput((luaOutput) => [
						...luaOutput,
						{
							text: args.map((arg, i) => <React.Fragment key={i}>{formatLuaValue(lua, arg)} </React.Fragment>),
							what: "print",
						},
					]);
				});

				// go nuts
				lua.global.set("JSON", JSON);

				const methodProxy = (target) =>
					new Proxy(target, {
						get: (target, prop) => {
							if (typeof target[prop] === "function") {
								return target[prop].bind(target);
							} else {
								return target[prop];
							}
						},
					});

				// function autoAwait(name, fn) {
				// 	lua.global.set(name, fn);
				// 	lua.doString(`do
				//             local fn = ${name}
				//             ${name} = nil
				//             function ${name}(...)
				//             return fn(...):await()
				//             end
				//             end`);
				// }
				// autoAwait("fetch", (...args) => fetch(...args).then(methodProxy));

				lua.global.set("_fetchModuleCode", async (module: string) => {
					return await fetch(`/app/lua/${module}.lua`).then((r) => {
						if (!r.ok) {
							throw new Error(`Failed to fetch module ${module}`);
						}
						return r.text();
					});
				});
				await lua.doString(`do
                    local fetchModuleCode = _fetchModuleCode
                    _fetchModuleCode = nil
                    require = function(module)
                        local code = fetchModuleCode(module):await()
                        return load(code)()
                    end
                end`);

				setLua(lua);

				lua.doString(`
                    inspect = require('inspect')
                    _ = require('pipeline')
                `);
			});
	}, []);

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const [inputHistoryIndex, setInputHistoryIndex] = useState(-1);

	return (
		<div>
			<div ref={containerRef} className="output-container hljs">
				{luaOutput.map(({ text, what }, idx) => (
					<div key={idx} className={`${what} block`}>
						{text}
					</div>
				))}
			</div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setLuaOutput((luaOutput) => [...luaOutput, { text: luaInput, what: "input" }]);
					try {
						let output;
						try {
							output = await lua!.doString("return " + luaInput);
						} catch (e) {
							output = await lua!.doString(luaInput);
						}
						output = formatLuaValue(lua, output);
						setLuaOutput((luaOutput) => [...luaOutput, { text: output, what: "output" }]);
					} catch (e) {
						setLuaOutput((luaOutput) => [...luaOutput, { text: e.message, what: "error" }]);
					}
					setLuaInput("");
					setInputHistoryIndex(-1);
					setTimeout(() => {
						if (containerRef.current) {
							containerRef.current.scrollTop = containerRef.current.scrollHeight;
						}
					}, 0);
				}}
			>
				<input
					ref={inputRef}
					value={luaInput}
					onChange={(e) => setLuaInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "ArrowUp" || e.key === "ArrowDown") {
							e.preventDefault();
							const direction = e.key === "ArrowUp" ? -1 : 1;
							const idx = inputHistoryIndex + direction;
							setInputHistoryIndex(idx);
							const inputHistory = [...luaOutput.filter((o) => o.what === "input").map((o) => o.text), ""];
							const entry = inputHistory.at(idx % inputHistory.length);
							setLuaInput(entry ?? "");
						}
					}}
				/>
				<button type="submit">Run</button>
			</form>
		</div>
	);
}

export default makeInit(App);
