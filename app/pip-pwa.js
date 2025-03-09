import { h } from "./lib/userscript.js";
/* empty css            */
document.head.append(Object.assign(document.createElement("link"), {
  rel: "stylesheet",
  href: "/app/pip-pwa.css"
}));
function init(el) {
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
      video.requestPictureInPicture();
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
