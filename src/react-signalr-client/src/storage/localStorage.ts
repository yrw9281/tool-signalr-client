import type { ConnectionHistory, MethodHistoryByConnection } from "../types";

const HISTORY_STORAGE_KEY = "signalr-connection-history";
const METHOD_HISTORY_STORAGE_KEY = "signalr-method-history";

/**
 * Generic function to load data from localStorage
 */
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Generic function to save data to localStorage
 */
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
};

/**
 * Load connection history from localStorage
 */
export const loadConnectionHistory = (): ConnectionHistory[] =>
  loadFromStorage(HISTORY_STORAGE_KEY, []);

/**
 * Save connection history to localStorage
 */
export const saveConnectionHistory = (history: ConnectionHistory[]): void =>
  saveToStorage(HISTORY_STORAGE_KEY, history);

/**
 * Load method history from localStorage
 */
export const loadMethodHistory = (): MethodHistoryByConnection =>
  loadFromStorage(METHOD_HISTORY_STORAGE_KEY, {});

/**
 * Save method history to localStorage
 */
export const saveMethodHistory = (history: MethodHistoryByConnection): void =>
  saveToStorage(METHOD_HISTORY_STORAGE_KEY, history);
