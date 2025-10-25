import { useEffect, useRef } from "react";
import { transportLabels } from "../../constants";
import { primaryButtonClass, secondaryButtonClass } from "../../styles";
import type { ConnectionHistory } from "../../types";

interface ConnectionHistoryModalProps {
  isOpen: boolean;
  history: ConnectionHistory[];
  currentHubUrl: string;
  onClose: () => void;
  onSelect: (item: ConnectionHistory) => void;
  onDelete: (url: string) => void;
}

const ConnectionHistoryModal = ({
  isOpen,
  history,
  currentHubUrl,
  onClose,
  onSelect,
  onDelete,
}: ConnectionHistoryModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Connection History
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-4 h-16 w-16 text-slate-300"
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
              <p className="text-lg font-medium text-slate-600">
                No connection history yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Connect to a hub to save it to your history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.url}
                  className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <h3 className="break-all font-semibold text-slate-900">
                        {item.url}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 font-medium text-indigo-700">
                          {transportLabels[item.transport]}
                        </span>
                        {item.useToken && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-700">
                            With Token
                          </span>
                        )}
                        {item.withCredentials && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-700">
                            With Credentials
                          </span>
                        )}
                        {item.skipNegotiation && (
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 font-medium text-purple-700">
                            Skip Negotiation
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Last connected: {item.lastConnected}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      disabled={item.url === currentHubUrl}
                      className={`${primaryButtonClass} flex-1 text-sm disabled:cursor-not-allowed disabled:opacity-50`}
                      title={
                        item.url === currentHubUrl
                          ? "Already using this connection"
                          : "Load these settings"
                      }
                    >
                      Load Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.url)}
                      className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButtonClass}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionHistoryModal;
