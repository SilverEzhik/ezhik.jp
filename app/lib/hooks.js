import { a as reactExports } from "../dependencies/react.js";
function useLocalStorage(key, initialValue) {
  const [value, setValue] = reactExports.useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue != null) {
        return JSON.parse(storedValue);
      }
    } catch {
    }
    return initialValue;
  });
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value ?? null));
    } catch (e) {
      console.error("localStorage machine broke", e);
    }
  }, [key, value]);
  reactExports.useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        if (event.newValue == null) {
          setValue(initialValue);
        } else {
          try {
            setValue(JSON.parse(event.newValue));
          } catch (e) {
            console.error("localStorage machine broke (and some other tab is to blame)", e);
            setValue(initialValue);
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);
  return [value, setValue];
}
export {
  useLocalStorage
};
//# sourceMappingURL=hooks.js.map
