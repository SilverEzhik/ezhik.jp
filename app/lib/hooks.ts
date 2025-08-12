import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(() => {
		try {
			const storedValue = localStorage.getItem(key);
			if (storedValue != null) {
				return JSON.parse(storedValue);
			}
		} catch {
			// whatevs
		}
		return initialValue;
	});

	useEffect(() => {
		try {
			// why is JSON.stringify(undefined) === undefined, what the fuck?
			localStorage.setItem(key, JSON.stringify(value ?? null));
		} catch (e) {
			console.error("localStorage machine broke", e);
		}
	}, [key, value]);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === key) {
				if (event.newValue == null) {
					setValue(initialValue);
				} else {
					try {
						setValue(JSON.parse(event.newValue));
					} catch (e) {
						// i guess some other tab fucked up big time
						console.error("localStorage machine broke (and some other tab is to blame)", e);
						setValue(initialValue);
					}
				}
			}
		};
		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [key, initialValue]);

	return [value, setValue] as const;
}
