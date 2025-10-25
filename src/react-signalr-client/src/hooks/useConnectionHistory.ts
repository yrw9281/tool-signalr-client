import { useCallback, useEffect, useState } from "react";
import type { ConnectionHistory } from "../types";
import { loadConnectionHistory, saveConnectionHistory } from "../storage";

/**
 * Custom hook for managing connection history
 */
export const useConnectionHistory = () => {
  const [connectionHistory, setConnectionHistory] = useState<
    ConnectionHistory[]
  >([]);

  // Load history on mount
  useEffect(() => {
    setConnectionHistory(loadConnectionHistory());
  }, []);

  const addToHistory = useCallback((item: ConnectionHistory) => {
    setConnectionHistory((prevHistory) => {
      // Remove existing entry with the same URL and add new entry at the beginning
      const updatedHistory = [
        item,
        ...prevHistory.filter((h) => h.url !== item.url),
      ].slice(0, 10); // Keep only the last 10 entries
      saveConnectionHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  const deleteFromHistory = useCallback((url: string) => {
    setConnectionHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((item) => item.url !== url);
      saveConnectionHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  return {
    connectionHistory,
    addToHistory,
    deleteFromHistory,
  };
};
