import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { WebStorage } from "redux-persist/lib/types";

export function createPersistStorage(): WebStorage {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // noop storage for SSR
    return {
      getItem(_key: string) {
        return Promise.resolve(null);
      },
      setItem(_key: string, _value: string) {
        return Promise.resolve();
      },
      removeItem(_key: string) {
        return Promise.resolve();
      },
    };
  }

  return createWebStorage("local");
}
