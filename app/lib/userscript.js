const p = console.log.bind(console);
const h = (tag, attributes = {}, ...children) => {
  const el = typeof tag == "function" ? tag(attributes) : Object.assign(document.createElement(tag), attributes);
  el.append(...children);
  return el;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const debounce = (fn, ms) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
};
const onDomContentLoaded = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
export {
  $,
  $$,
  debounce,
  h,
  onDomContentLoaded,
  p,
  sleep
};
