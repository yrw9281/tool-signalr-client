import { useCallback, useEffect, useState } from "react";
import type { MethodHistoryByConnection, MethodHistoryItem } from "../types";
import { loadMethodHistory, saveMethodHistory } from "../storage";

/**
 * Custom hook for managing method history
 */
export const useMethodHistory = () => {
  const [methodHistory, setMethodHistory] = useState<MethodHistoryByConnection>(
    {}
  );

  // Load history on mount
  useEffect(() => {
    setMethodHistory(loadMethodHistory());
  }, []);

  const addToMethodHistory = useCallback(
    (url: string, item: MethodHistoryItem) => {
      setMethodHistory((prevHistory) => {
        const updatedHistory = {
          ...prevHistory,
          [url]: [item, ...(prevHistory[url] || [])].slice(0, 20), // Keep only the last 20 methods per URL
        };
        saveMethodHistory(updatedHistory);
        return updatedHistory;
      });
    },
    []
  );

  const deleteMethodHistory = useCallback((url: string, timestamp: string) => {
    setMethodHistory((prevHistory) => {
      const updatedUrlMethods = (prevHistory[url] || []).filter(
        (item) => item.timestamp !== timestamp
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
