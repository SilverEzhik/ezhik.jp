/**
 * Logs to the console. Shortcut for console.log.
 * @param {...any} args - Arguments to log to the console.
 */
export const p: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export function h<T extends keyof HTMLElementTagNameMap | ((attrs: any) => HTMLElement)>(tag: T, attributes?: Partial<T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement> | Record<string, any>, ...children: (HTMLElement | string)[]): T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement;
export function sleep(ms: number): Promise<void>;
export function debounce<F extends (...args: any[]) => any>(fn: F, ms: number): (...args: Parameters<F>) => void;
export function onDomContentLoaded(fn: Function): void;
/**
 * Selects the first element matching the given CSS selector.
 * @param {string} selector - A CSS selector string.
 * @returns {Element | null} The first matching element, or null if none found.
 */
export const $: {
    <K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    <K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    <K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
    <K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K] | null;
    <E extends Element = Element>(selectors: string): E | null;
};
/**
 * Selects all elements matching the given CSS selector.
 * @param {string} selector - A CSS selector string.
 * @returns {NodeListOf<Element>} A live NodeList of matching elements.
 */
export const $$: {
    <K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
    <K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
    <K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
    <K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
    <E extends Element = Element>(selectors: string): NodeListOf<E>;
};
//# sourceMappingURL=userscript.d.ts.map