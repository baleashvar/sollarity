// Safe localStorage JSON helpers
export function safeGetJSON(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`safeGetJSON failed for key "${key}":`, err);
    return defaultValue;
  }
}

export function safeSetJSON(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`safeSetJSON failed for key "${key}":`, err);
  }
}

export function safeRemoveItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`safeRemoveItem failed for key "${key}":`, err);
  }
}
