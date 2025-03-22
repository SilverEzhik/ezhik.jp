import { h } from "./lib/userscript.js";
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
    const file = input.files?.[0];
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
    e.preventDefault();
    console.log("drop");
    if (e.dataTransfer?.files?.length) {
      input.files = e.dataTransfer?.files;
      input.dispatchEvent(new Event("change"));
    }
  });
}
export {
  init as default
};
//# sourceMappingURL=pip-pwa.js.map
