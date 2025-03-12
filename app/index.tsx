import React from "react";
import { renderToString } from "react-dom/server";
// import { render } from "react-dom";

console.log("hello", React, renderToString(<div>hello</div>));

export const foo = "123";
