import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  type IHttpConnectionOptions,
} from "@microsoft/signalr";
import { transportMap } from "../constants";
import type { TransportKey } from "../types";

export interface SignalRConnectionOptions {
  hubUrl: string;
  transport: TransportKey;
  useToken: boolean;
  token: string;
  withCredentials: boolean;
  skipNegotiation: boolean;
}

/**
 * Create and configure a SignalR hub connection
 */
export const createHubConnection = (
  options: SignalRConnectionOptions
): HubConnection => {
  const {
    hubUrl,
    transport,
    useToken,
    token,
    withCredentials,
    skipNegotiation,
  } = options;

  const connectionOptions: IHttpConnectionOptions = {
    transport: transportMap[transport],
    withCredentials,
  };

  if (skipNegotiation && transport === "webSockets") {
    connectionOptions.skipNegotiation = true;
  }

  if (useToken && token.trim()) {
    connectionOptions.accessTokenFactory = () => token.trim();
  }

  return new HubConnectionBuilder()
    .withUrl(hubUrl, connectionOptions)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
};

/**
 * Invoke a method on the SignalR hub
 */
export const invokeHubMethod = async (
  connection: HubConnection,
  methodName: string,
  args: unknown[]
): Promise<unknown> => {
  return await connection.invoke(methodName, ...args);
};
