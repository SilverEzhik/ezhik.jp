/**
 * Logs to the console. Shortcut for console.log.
 * @param {...any} args - Arguments to log to the console.
 */
export const p = console.log.bind(console);
/**
 * Creates an HTML element or invokes a custom component function.
 * @template {keyof HTMLElementTagNameMap | ((attrs: any) => HTMLElement)} T
 * @param {T} tag - The HTML tag name or a function that returns an element.
 * @param {Partial<T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement> | Record<string, any>} [attributes={}] - Attributes to set on the element.
 * @param {...(HTMLElement|string)} children - Child elements or text nodes.
 * @returns {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement} The created element.
 */
export const h = (tag, attributes = {}, ...children) => {
	/** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement} */
	const el = typeof tag == "function" ? tag(attributes) : Object.assign(document.createElement(tag), attributes);
	el.append(...children);
	return el;
};
/**
 * Creates a promise that resolves after a specified duration.
 * @param {number} ms - The duration in milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified duration.
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * Creates a debounced version of a function that delays its execution.
 * @template {(...args: any[]) => any} F
 * @param {F} fn - The function to debounce.
 * @param {number} ms - The debounce delay in milliseconds.
 * @returns {(...args: Parameters<F>) => void} The debounced function.
 */
export const debounce = (fn, ms) => {
	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.apply(this, args), ms);
	};
};
/**
 * Executes a callback function when the DOM content is loaded.
 * @param {Function} fn - The callback function to execute when DOM content is loaded
 */
export const onDomContentLoaded = (fn) => {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", fn);
	} else {
		fn();
	}
};
/**
 * Selects the first element matching the given CSS selector.
 * @param {string} selector - A CSS selector string.
 * @returns {Element | null} The first matching element, or null if none found.
 */
export const $ = document.querySelector.bind(document);
/**
 * Selects all elements matching the given CSS selector.
 * @param {string} selector - A CSS selector string.
 * @returns {NodeListOf<Element>} A live NodeList of matching elements.
 */
export const $$ = document.querySelectorAll.bind(document);
