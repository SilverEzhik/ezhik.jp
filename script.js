import { h } from "/app/lib/userscript.js";

document.addEventListener("DOMContentLoaded", function () {
	for (const pre of document.querySelectorAll(`pre:has(code.hljs)`)) {
		const button = h(
			"button",
			{
				className: "copy",
			},
			"Copy",
		);
		button.addEventListener("click", function () {
			navigator.clipboard.writeText(pre.querySelector(`code.hljs`).textContent);
			button.textContent = "OK";
			setTimeout(() => {
				button.textContent = "Copy";
			}, 500);
		});
		pre.append(button);
	}
});
