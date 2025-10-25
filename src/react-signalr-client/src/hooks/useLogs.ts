import { useCallback, useState } from "react";
import type { LogEntry } from "../types";
import { makeId } from "../utils";

/**
 * Custom hook for managing logs
 */
export const useLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const appendLog = useCallback((entry: Omit<LogEntry, "id" | "timestamp">) => {
    setLogs((previous) => [
      {
        ...entry,
        id: makeId(),
        timestamp: new Date().toLocaleString(),
      },
      ...previous,
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    appendLog,
    clearLogs,
  };
};
