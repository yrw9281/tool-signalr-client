import { useId } from "react";
import { InfoHint } from "../shared";
import {
  badgeBaseClass,
  inputFieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../styles";
import type { ConnectionPhase, TransportKey } from "../../types";

interface ConnectionSettingsProps {
  hubUrl: string;
  onHubUrlChange: (value: string) => void;
  useToken: boolean;
  onUseTokenChange: (value: boolean) => void;
  token: string;
  onTokenChange: (value: string) => void;
  transport: TransportKey;
  transportOptions: Array<[TransportKey, string]>;
  onTransportChange: (value: TransportKey) => void;
  withCredentials: boolean;
  onWithCredentialsChange: (value: boolean) => void;
  skipNegotiation: boolean;
  canSkipNegotiation: boolean;
  onSkipNegotiationChange: (value: boolean) => void;
  connectionState: ConnectionPhase;
  onConnect: () => void;
  onDisconnect: () => void;
  errorMessage: string | null;
  onOpenHistory: () => void;
}

const renderStatusLabel = (state: ConnectionPhase) => {
  switch (state) {
    case "connected":
      return "Connected";
    case "connecting":
      return "Connecting";
    default:
      return "Disconnected";
  }
};

const statusStyles: Record<ConnectionPhase, string> = {
  disconnected: "bg-slate-200 text-slate-900",
  connecting: "bg-amber-100 text-amber-800",
  connected: "bg-emerald-100 text-emerald-700",
};

const ConnectionSettings = ({
  hubUrl,
  onHubUrlChange,
  useToken,
  onUseTokenChange,
  token,
  onTokenChange,
  transport,
  transportOptions,
  onTransportChange,
  withCredentials,
  onWithCredentialsChange,
  skipNegotiation,
  canSkipNegotiation,
  onSkipNegotiationChange,
  connectionState,
  onConnect,
  onDisconnect,
  errorMessage,
  onOpenHistory,
}: ConnectionSettingsProps) => {
  const hubInputId = useId();
  const tokenInputId = useId();
  const transportSelectId = useId();

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Connection Settings
        </h2>
        <div className="flex items-center gap-3">
          <div className={`${badgeBaseClass} ${statusStyles[connectionState]}`}>
            Status: {renderStatusLabel(connectionState)}
          </div>
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-2 rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5 text-sm">
          <label
            htmlFor={hubInputId}
            className="inline-flex items-center gap-2 font-semibold text-slate-600"
          >
            Hub Address
            <InfoHint message="Full SignalR Hub URL, e.g. https://example.com/hub." />
          </label>
          <input
            id={hubInputId}
            type="text"
            placeholder="https://example.com/hub"
            value={hubUrl}
            onChange={(event) => onHubUrlChange(event.target.value)}
            spellCheck={false}
            className={inputFieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={tokenInputId}
              className="inline-flex items-center gap-2 font-semibold text-slate-600"
            >
              Bearer Token
              <InfoHint message="JWT or other bearer token. Leave empty to skip authorization." />
            </label>
            <label className="inline-flex items-center gap-2 font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={useToken}
                onChange={(event) => onUseTokenChange(event.target.checked)}
                className="h-5 w-5 accent-indigo-500"
              />
              Use token (Authorization header)
            </label>
          </div>
          <input
            id={tokenInputId}
            type="text"
            value={token}
            onChange={(event) => onTokenChange(event.target.value)}
            placeholder="ey..."
            disabled={!useToken}
            className={`${inputFieldClass} disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500`}
          />
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <label
            htmlFor={transportSelectId}
            className="inline-flex items-center gap-2 font-semibold text-slate-600"
          >
            Transport Type
            <InfoHint message="Select the transport channel for SignalR. Defaults to WebSockets; switch to SSE or Long Polling if needed." />
          </label>
          <select
            id={transportSelectId}
            value={transport}
            onChange={(event) =>
              onTransportChange(event.target.value as TransportKey)
            }
            className={inputFieldClass}
          >
            {transportOptions.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex w-full items-start gap-3 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={withCredentials}
            onChange={(event) => onWithCredentialsChange(event.target.checked)}
            className="mt-1 h-5 w-5 accent-indigo-500"
          />
          <span className="inline-flex items-center gap-2 text-left">
            With Credentials
            <InfoHint message="Allow the browser to send cookies or basic auth credentials on cross-site requests. Server support required." />
          </span>
        </label>

        <label
          className={`flex w-full items-start gap-3 text-sm font-semibold text-slate-600 ${
            canSkipNegotiation ? "" : "opacity-60"
          }`}
        >
          <input
            type="checkbox"
            checked={skipNegotiation && canSkipNegotiation}
            onChange={(event) => onSkipNegotiationChange(event.target.checked)}
            disabled={!canSkipNegotiation}
            className="mt-1 h-5 w-5 accent-indigo-500"
          />
          <span className="inline-flex items-center gap-2 text-left">
            Skip Negotiation (WebSockets only)
            <InfoHint message="Skip the negotiate phase and connect via WebSockets directly. Use only when both the server and browser support WebSockets." />
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onConnect}
          disabled={connectionState !== "disconnected"}
          className={primaryButtonClass}
        >
          Connect
        </button>
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={onDisconnect}
          disabled={connectionState === "disconnected"}
        >
          Disconnect
        </button>
      </div>

      {errorMessage ? (
        <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
};

export default ConnectionSettings;
