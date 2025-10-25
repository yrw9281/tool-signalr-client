import { useEffect, useRef } from "react";
import { primaryButtonClass, secondaryButtonClass } from "../../styles";
import type { MethodHistoryByConnection, MethodHistoryItem } from "../../types";

interface MethodHistoryModalProps {
  isOpen: boolean;
  methodHistory: MethodHistoryByConnection;
  currentHubUrl: string;
  onClose: () => void;
  onSelect: (item: MethodHistoryItem) => void;
  onDelete: (url: string, methodId: string) => void;
  onDeleteAll: (url: string) => void;
}

const MethodHistoryModal = ({
  isOpen,
  methodHistory,
  currentHubUrl,
  onClose,
  onSelect,
  onDelete,
  onDeleteAll,
}: MethodHistoryModalProps) => {
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

  // Only show methods for the current connection URL
  const currentUrlMethods = currentHubUrl
    ? methodHistory[currentHubUrl] || []
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Method Invocation History
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
          {!currentHubUrl || currentUrlMethods.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-lg font-medium text-slate-600">
                {!currentHubUrl
                  ? "No connection selected"
                  : "No method history yet"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {!currentHubUrl
                  ? "Enter a Hub URL to view its method history"
                  : "Invoke a server method to save it to your history"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3 bg-indigo-50 p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="break-all font-semibold text-slate-900">
                        {currentHubUrl}
                      </h3>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        Current
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {currentUrlMethods.length} method
                      {currentUrlMethods.length !== 1 ? "s" : ""} recorded
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteAll(currentHubUrl)}
                    className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    Clear All
                  </button>
                </div>

                <div className="border-t border-slate-200 bg-white p-4">
                  <div className="space-y-3">
                    {currentUrlMethods.map((method) => (
                      <div
                        key={method.id}
                        className="group rounded-lg border border-slate-200 bg-slate-50 p-3 transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-indigo-100 px-2 py-1 font-mono text-sm font-semibold text-indigo-700">
                                {method.methodName}
                              </span>
                              <span className="text-xs text-slate-500">
                                {method.timestamp}
                              </span>
                            </div>
                            {method.args.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-600">
                                  Parameters:
                                </p>
                                {method.args.map((arg, idx) => (
                                  <div
                                    key={arg.id}
                                    className="flex gap-2 text-xs"
                                  >
                                    <span className="font-semibold text-slate-500">
                                      #{idx + 1}
                                    </span>
                                    <span className="rounded bg-slate-200 px-1.5 py-0.5 font-medium text-slate-700">
                                      {arg.type}
                                    </span>
                                    <code className="flex-1 break-all rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">
                                      {arg.value || "(empty)"}
                                    </code>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSelect(method);
                              onClose();
                            }}
                            className={`${primaryButtonClass} flex-1 text-sm`}
                          >
                            Load Method
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onDelete(currentHubUrl, method.id)
                            }
                            className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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

export default MethodHistoryModal;
