import { h } from "./lib/userscript";

export default function init(el) {
	// const metaIcon = h("link", {
	// 	rel: "apple-touch-icon",
	// 	href: "/favicon.png",
	// });
	// document.head.append(metaIcon);
	// const metaWebAppCapable = h("meta", {
	// 	name: "apple-mobile-web-app-capable",
	// 	content: "yes",
	// });
	// document.head.append(metaWebAppCapable);

	// const appName = "Play in PiP";
	// const metaWebAppTitle = h("meta", {
	// 	name: "apple-mobile-web-app-title",
	// 	content: appName,
	// });
	// document.head.append(metaWebAppTitle);
	// const metaApplicationName = h("meta", {
	// 	name: "application-name",
	// 	content: appName,
	// });
	// document.head.append(metaApplicationName);

	const input = h("input", { type: "file", accept: "video/*" });
	el.append(input);

	const videoContainer = h("div", { className: "video-container" });
	el.append(videoContainer);
	const video = h("video", {
		controls: true,
		src: "/assets/spinning-hogs.mp4",
		loop: true,
		autoplay: true,
	});
	el.append(video);
	video.play();

	let loadedFirst = false;
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

		if (loadedFirst) {
			video.loop = false;
			loadedFirst = true;
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
