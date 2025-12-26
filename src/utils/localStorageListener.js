import { useEffect } from "react";

/**
 * Hook that listens to localStorage changes and runs a callback.
 * Detects both same-tab and multi-tab updates.
 */
export function useLocalStorageListener(callback, keys = []) {
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (!event || keys.length === 0 || keys.includes(event.key)) {
        callback(event);
      }
    };

    // Detect changes in other tabs
    window.addEventListener("storage", handleStorageChange);

    // Patch same-tab updates
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key) {
      originalSetItem.apply(this, arguments);
      handleStorageChange({ key });
    };

    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function (key) {
      originalRemoveItem.apply(this, arguments);
      handleStorageChange({ key });
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, [callback, keys]);
}
