import { useCallback, useEffect, useState } from "react";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import {
  createHubConnection,
  type SignalRConnectionOptions,
} from "../services";
import type { ConnectionPhase, LogEntry } from "../types";

interface UseSignalRConnectionOptions {
  onLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
}

/**
 * Custom hook for managing SignalR connection
 */
export const useSignalRConnection = ({
  onLog,
}: UseSignalRConnectionOptions) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionPhase>("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connection && connection.state !== HubConnectionState.Disconnected) {
        void connection.stop();
      }
    };
  }, [connection]);

  const connect = useCallback(
    async (options: SignalRConnectionOptions) => {
      if (!options.hubUrl.trim()) {
        setErrorMessage("Please enter the Hub Address first.");
        return false;
      }

      if (connectionState !== "disconnected") {
        setErrorMessage(
          "Invalid connection state. Disconnect the current session first."
        );
        return false;
      }

      setErrorMessage(null);
      setConnectionState("connecting");

      try {
        const hubConnection = createHubConnection(options);

        hubConnection.onclose((error) => {
          setConnection(null);
          setConnectionState("disconnected");
          onLog({
            kind: error ? "error" : "system",
            message: error
              ? `Connection closed: ${error.message}`
              : "Connection closed.",
          });
        });

        hubConnection.onreconnecting((error) => {
          setConnectionState("connecting");
          onLog({
            kind: "system",
            message: error
              ? `Reconnecting (reason: ${error.message})`
              : "Reconnecting...",
          });
        });

        hubConnection.onreconnected((connectionId) => {
          setConnectionState("connected");
          onLog({
            kind: "system",
            message: connectionId
              ? `Reconnected (ConnectionId: ${connectionId})`
              : "Reconnected.",
          });
        });

        await hubConnection.start();

        setConnection(hubConnection);
        setConnectionState("connected");
        onLog({
          kind: "system",
          message: "SignalR connection established.",
        });

        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setConnectionState("disconnected");
        setErrorMessage(`Failed to establish connection: ${message}`);
        onLog({
          kind: "error",
          message: `Failed to establish connection: ${message}`,
        });
        return false;
      }
    },
    [connectionState, onLog]
  );

  const disconnect = useCallback(async () => {
    setErrorMessage(null);

    if (!connection) {
      onLog({
        kind: "system",
        message: "No active connection to disconnect.",
      });
      return;
    }

    try {
      await connection.stop();
      setConnection(null);
      setConnectionState("disconnected");
      onLog({
        kind: "system",
        message: "SignalR connection has been disconnected.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Failed to disconnect: ${message}`);
      onLog({ kind: "error", message: `Failed to disconnect: ${message}` });
    }
  }, [connection, onLog]);

  return {
    connection,
    connectionState,
    errorMessage,
    setErrorMessage,
    connect,
    disconnect,
  };
};
