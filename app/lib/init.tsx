import React from "react";
import { Container, createRoot } from "react-dom/client";

export function initApp(
	node: Container,
	App: React.JSX.ElementType,
	props: Record<string, unknown> = {},
	children: unknown,
) {
	// hehe
	createRoot(node).render(<App {...props}>{children}</App>);
}

export function makeInit(App) {
	return function init(el) {
		createRoot(el).render(<App />);
	};
}
