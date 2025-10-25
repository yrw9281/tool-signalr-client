export type TransportKey = "webSockets" | "serverSentEvents" | "longPolling";

export type ArgType = "text" | "number" | "json";

export type LogKind = "request" | "response" | "system" | "error" | "incoming";

export type ConnectionPhase = "disconnected" | "connecting" | "connected";

export interface PayloadArg {
  id: string;
  type: ArgType;
  value: string;
}

export interface LogEntry {
  id: string;
  kind: LogKind;
  method?: string;
  message?: string;
  payload?: unknown;
  timestamp: string;
}

export interface ConnectionHistory {
  url: string;
  useToken: boolean;
  token: string;
  transport: TransportKey;
  withCredentials: boolean;
  skipNegotiation: boolean;
  lastConnected: string;
}

export interface MethodHistoryItem {
  methodName: string;
  args: PayloadArg[];
  timestamp: string;
}

export interface MethodHistoryByConnection {
  [url: string]: MethodHistoryItem[];
}
