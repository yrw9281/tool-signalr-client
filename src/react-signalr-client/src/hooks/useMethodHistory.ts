import { useCallback, useEffect, useState } from "react";
import type { MethodHistoryByConnection, MethodHistoryItem } from "../types";
import { loadMethodHistory, saveMethodHistory } from "../storage";
import { makeId } from "../utils";

/**
 * Custom hook for managing method history
 */
export const useMethodHistory = () => {
  const [methodHistory, setMethodHistory] = useState<MethodHistoryByConnection>(
    {}
  );

  // Load history on mount
  useEffect(() => {
    const loadedHistory = loadMethodHistory();
    let requiresSave = false;

    const normalizedHistory = Object.fromEntries(
      Object.entries(loadedHistory).map(([url, items]) => {
        const normalizedItems = items.map((item) => {
          if (!item.id) {
            requiresSave = true;
            return { ...item, id: makeId() };
          }
          return item;
        });
        return [url, normalizedItems];
      })
    ) as MethodHistoryByConnection;

    setMethodHistory(normalizedHistory);

    if (requiresSave) {
      saveMethodHistory(normalizedHistory);
    }
  }, []);

  const addToMethodHistory = useCallback(
    (url: string, item: Omit<MethodHistoryItem, "id">) => {
      setMethodHistory((prevHistory) => {
        const entry: MethodHistoryItem = { ...item, id: makeId() };
        const updatedHistory = {
          ...prevHistory,
          [url]: [entry, ...(prevHistory[url] || [])].slice(0, 20), // Keep only the last 20 methods per URL
        };
        saveMethodHistory(updatedHistory);
        return updatedHistory;
      });
    },
    []
  );

  const deleteMethodHistory = useCallback((url: string, methodId: string) => {
    setMethodHistory((prevHistory) => {
      const updatedUrlMethods = (prevHistory[url] || []).filter(
        (item) => item.id !== methodId
      );

      const updatedHistory = { ...prevHistory };
      if (updatedUrlMethods.length === 0) {
        delete updatedHistory[url];
      } else {
        updatedHistory[url] = updatedUrlMethods;
      }

      saveMethodHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  const deleteAllMethodHistory = useCallback((url: string) => {
    setMethodHistory((prevHistory) => {
      const updatedHistory = { ...prevHistory };
      delete updatedHistory[url];
      saveMethodHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  return {
    methodHistory,
    addToMethodHistory,
    deleteMethodHistory,
    deleteAllMethodHistory,
    // Alias for consistency
    deleteMethodHistoryForConnection: deleteAllMethodHistory,
  };
};
