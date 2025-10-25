import { type FormEvent } from "react";
import {
  inputFieldClass,
  primaryButtonClass,
  secondaryButtonClass,
  textAreaFieldClass,
} from "../../styles";
import type { ArgType, ConnectionPhase, PayloadArg } from "../../types";

interface InvokeServerMethodProps {
  methodName: string;
  onMethodNameChange: (value: string) => void;
  args: PayloadArg[];
  onAddArg: () => void;
  onRemoveArg: (id: string) => void;
  onArgTypeChange: (id: string, type: ArgType) => void;
  onArgValueChange: (id: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSending: boolean;
  connectionState: ConnectionPhase;
  onOpenHistory: () => void;
}

const InvokeServerMethod = ({
  methodName,
  onMethodNameChange,
  args,
  onAddArg,
  onRemoveArg,
  onArgTypeChange,
  onArgValueChange,
  onSubmit,
  isSending,
  connectionState,
  onOpenHistory,
}: InvokeServerMethodProps) => (
  <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
    <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900">
        Invoke Server Method
      </h2>
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
    </header>

    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-slate-600">Server Method Name</span>
        <input
          type="text"
          value={methodName}
          onChange={(event) => onMethodNameChange(event.target.value)}
          placeholder="SendMessage"
          className={inputFieldClass}
        />
      </label>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Request Payload
          </h3>
          <button
            type="button"
            onClick={onAddArg}
            className={secondaryButtonClass}
          >
            Add Parameter
          </button>
        </div>

        {args.length === 0 ? (
          <p className="text-sm text-slate-500">
            No parameters configured yet.
          </p>
        ) : null}

        {args.map((arg, index) => (
          <div
            key={arg.id}
            className="flex flex-col gap-2 md:grid md:items-center md:gap-2 md:[grid-template-columns:56px_minmax(120px,_160px)_1fr_auto]"
          >
            <div className="font-semibold text-slate-600">#{index + 1}</div>
            <select
              value={arg.type}
              onChange={(event) =>
                onArgTypeChange(arg.id, event.target.value as ArgType)
              }
              className={inputFieldClass}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="json">JSON</option>
            </select>

            {arg.type === "json" ? (
              <textarea
                value={arg.value}
                onChange={(event) =>
                  onArgValueChange(arg.id, event.target.value)
                }
                placeholder='{"message": "Hello"}'
                rows={3}
                className={textAreaFieldClass}
              />
            ) : (
              <input
                type={arg.type === "number" ? "number" : "text"}
                value={arg.value}
                onChange={(event) =>
                  onArgValueChange(arg.id, event.target.value)
                }
                className={inputFieldClass}
              />
            )}

            <button
              type="button"
              className={`${secondaryButtonClass} min-w-20 justify-self-start md:justify-self-start`}
              onClick={() => onRemoveArg(arg.id)}
              title="Remove parameter"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSending || connectionState !== "connected"}
          className={primaryButtonClass}
        >
          {isSending ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  </section>
);

export default InvokeServerMethod;
