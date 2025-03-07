import { h } from "./lib/userscript.js";
{
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/app/pip-pwa.css";
  document.head.append(link);
}
function init(el) {
  const metaIcon = h("link", {
    rel: "apple-touch-icon",
    href: "/favicon.png"
  });
  document.head.append(metaIcon);
  const metaWebAppCapable = h("meta", {
    name: "apple-mobile-web-app-capable",
    content: "yes"
  });
  document.head.append(metaWebAppCapable);
  const appName = "Play in PiP";
  const metaWebAppTitle = h("meta", {
    name: "apple-mobile-web-app-title",
    content: appName
  });
  document.head.append(metaWebAppTitle);
  const metaApplicationName = h("meta", {
    name: "application-name",
    content: appName
  });
  document.head.append(metaApplicationName);
  const input = h("input", { type: "file", accept: "video/*" });
  el.append(input);
  const videoContainer = h("div", { className: "video-container" });
  el.append(videoContainer);
  const video = h("video", {
    controls: true,
    src: "/assets/spinning-hogs.mp4",
    loop: true,
    autoplay: true
  });
  el.append(video);
  video.play();
  input.addEventListener("change", () => {
    var _a;
    const file = (_a = input.files) == null ? void 0 : _a[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    video.src = url;
    video.play();
    try {
      video.controls = true;
    } catch (e) {
      console.error(e);
    }
  });
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log("dragover");
  });
  document.addEventListener("drop", (e) => {
    var _a, _b, _c;
    e.preventDefault();
    console.log("drop");
    if ((_b = (_a = e.dataTransfer) == null ? void 0 : _a.files) == null ? void 0 : _b.length) {
      input.files = (_c = e.dataTransfer) == null ? void 0 : _c.files;
      input.dispatchEvent(new Event("change"));
    }
  });
}
export {
  init as default
};
