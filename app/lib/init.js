import { j as jsxRuntimeExports } from "../dependencies/react.js";
import { c as clientExports } from "../dependencies/react-dom.js";
function initApp(node, App, props = {}, children) {
  clientExports.createRoot(node).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, { ...props, children }));
}
function makeInit(App) {
  return function init(el) {
    clientExports.createRoot(el).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
  };
}
export {
  initApp,
  makeInit
};
