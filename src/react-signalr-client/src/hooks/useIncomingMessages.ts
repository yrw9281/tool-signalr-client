import { useEffect, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import type { LogEntry } from "../types";

interface UseIncomingMessagesOptions {
  connection: HubConnection | null;
  onLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
}

/**
 * Custom hook for listening to incoming messages from SignalR server
 * This hook registers handlers for common server-to-client methods
 */
export const useIncomingMessages = ({
  connection,
  onLog,
}: UseIncomingMessagesOptions) => {
  const [registeredMethods, setRegisteredMethods] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!connection) {
      setRegisteredMethods(new Set());
      return;
    }

    // Common method names that the server might call
    // Users can add more methods by manually registering them
    const commonMethods = [
      "ReceiveMessage",
      "SystemMessage",
      "Notification",
      "Update",
      "Broadcast",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registeredHandlers: Array<{
      method: string;
      handler: (...args: any[]) => void;
    }> = [];

    commonMethods.forEach((methodName) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler = (...args: any[]) => {
        onLog({
          kind: "incoming",
          method: methodName,
          payload: args.length === 1 ? args[0] : args,
          message: "Message received from server.",
        });
      };

      connection.on(methodName, handler);
      registeredHandlers.push({ method: methodName, handler });
    });

    setRegisteredMethods(new Set(commonMethods));

    // Cleanup: remove all registered handlers when connection changes or unmounts
    return () => {
      registeredHandlers.forEach(({ method, handler }) => {
        connection.off(method, handler);
      });
      setRegisteredMethods(new Set());
    };
  }, [connection, onLog]);

  // Method to register additional custom handlers
  const registerMethod = (methodName: string) => {
    if (!connection || registeredMethods.has(methodName)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (...args: any[]) => {
      onLog({
        kind: "incoming",
        method: methodName,
        payload: args.length === 1 ? args[0] : args,
        message: "Message received from server.",
      });
    };

    connection.on(methodName, handler);
    setRegisteredMethods((prev) => new Set([...prev, methodName]));
  };

  return {
    registeredMethods: Array.from(registeredMethods),
    registerMethod,
  };
};
