export function useStorage() {
  function getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function clear() {
    localStorage.clear();
  }

  function setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  return {
    getItem,
    setItem,
    clear,
  };
}
