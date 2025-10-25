import { useCallback, useState } from "react";
import type { ArgType, PayloadArg } from "../types";
import { makeId } from "../utils";

/**
 * Custom hook for managing method arguments
 */
export const useMethodArgs = () => {
  const [args, setArgs] = useState<PayloadArg[]>([]);

  const addArg = useCallback(() => {
    setArgs((previous) => [
      ...previous,
      { id: makeId(), type: "text", value: "" },
    ]);
  }, []);

  const removeArg = useCallback((id: string) => {
    setArgs((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const updateArg = useCallback(
    (id: string, updates: Partial<Omit<PayloadArg, "id">>) => {
      setArgs((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  const updateArgType = useCallback(
    (id: string, type: ArgType) => updateArg(id, { type }),
    [updateArg]
  );

  const updateArgValue = useCallback(
    (id: string, value: string) => updateArg(id, { value }),
    [updateArg]
  );

  const resetArgs = useCallback(() => {
    setArgs([]);
  }, []);

  const setArgsFromHistory = useCallback((historicalArgs: PayloadArg[]) => {
    setArgs(historicalArgs.map((arg) => ({ ...arg, id: makeId() })));
  }, []);

  return {
    args,
    addArg,
    removeArg,
    updateArgType,
    updateArgValue,
    resetArgs,
    setArgsFromHistory,
  };
};
