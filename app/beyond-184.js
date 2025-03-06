{
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/app/beyond-184.css";
  document.head.append(link);
}
function init(el) {
  const p = document.createElement("p");
  p.id = "canvascontainer";
  el.append(p);
  const p5 = document.createElement("script");
  p5.type = "text/javascript";
  p5.src = "/assets/old/beyond184/libraries/p5.js";
  el.append(p5);
  const sketch = document.createElement("script");
  sketch.type = "text/javascript";
  sketch.src = "/assets/old/beyond184/sketch.js";
  el.appendChild(sketch);
}
export {
  init as default
};
