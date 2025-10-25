import { secondaryButtonClass } from "../styles";
import type { LogEntry } from "../types";

interface RequestResponsePoolProps {
  logs: LogEntry[];
  onClear: () => void;
}

const logAccentByKind: Record<LogEntry["kind"], string> = {
  system: "text-blue-600",
  request: "text-violet-600",
  response: "text-emerald-600",
  error: "text-rose-600",
};

const RequestResponsePool = ({ logs, onClear }: RequestResponsePoolProps) => (
  <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-slate-900">
        Request / Response Log
      </h2>
      <div className="flex gap-3">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={onClear}
          disabled={logs.length === 0}
        >
          Clear Logs
        </button>
      </div>
    </header>

    {logs.length === 0 ? (
      <p className="text-sm text-slate-500">No entries yet.</p>
    ) : (
      <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto">
        {logs.map((entry) => {
          const payloadString =
            entry.payload !== undefined
              ? JSON.stringify(entry.payload, null, 2)
              : undefined;

          return (
            <li
              key={entry.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <header className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span className={logAccentByKind[entry.kind]}>
                  {entry.kind.toUpperCase()}
                </span>
                <span>{entry.timestamp}</span>
              </header>
              {entry.method ? (
                <div className="text-sm font-semibold text-slate-700">
                  Method: {entry.method}
                </div>
              ) : null}
              {entry.message ? (
                <div className="text-sm text-slate-700">{entry.message}</div>
              ) : null}
              {payloadString ? (
                <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                  {payloadString}
                </pre>
              ) : null}
            </li>
          );
        })}
      </ul>
    )}
  </section>
);

export default RequestResponsePool;
