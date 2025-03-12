export function injectCss(path: string) {
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = path;
	document.head.append(link);
}
