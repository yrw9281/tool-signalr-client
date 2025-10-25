import { HttpTransportType } from "@microsoft/signalr";
import type { TransportKey } from "./types";

export const transportLabels: Record<TransportKey, string> = {
  webSockets: "WebSockets",
  serverSentEvents: "Server-Sent Events",
  longPolling: "Long Polling",
};

export const transportMap: Record<TransportKey, HttpTransportType> = {
  webSockets: HttpTransportType.WebSockets,
  serverSentEvents: HttpTransportType.ServerSentEvents,
  longPolling: HttpTransportType.LongPolling,
};
