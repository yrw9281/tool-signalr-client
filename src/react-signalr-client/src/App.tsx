import { type FormEvent, useCallback, useState } from "react";
import {
  ConnectionSettings,
  InvokeServerMethod,
  RequestResponsePool,
  ConnectionHistoryModal,
  MethodHistoryModal,
} from "./components";
import { transportLabels } from "./constants";
import {
  useLogs,
  useSignalRConnection,
  useConnectionHistory,
  useMethodHistory,
  useMethodArgs,
  useIncomingMessages,
} from "./hooks";
import { buildArgs } from "./utils";
import { invokeHubMethod } from "./services";
import githubIcon from "./assets/github.svg";
import type {
  TransportKey,
  ConnectionHistory,
  MethodHistoryItem,
} from "./types";

const transportOptions = Object.entries(transportLabels) as Array<
  [TransportKey, string]
>;

function App() {
  // Connection settings state
  const [hubUrl, setHubUrl] = useState("");
  const [useToken, setUseToken] = useState(false);
  const [token, setToken] = useState("");
  const [transport, setTransport] = useState<TransportKey>("webSockets");
  const [withCredentials, setWithCredentials] = useState(false);
  const [skipNegotiation, setSkipNegotiation] = useState(false);

  // Method invocation state
  const [methodName, setMethodName] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMethodHistoryModalOpen, setIsMethodHistoryModalOpen] =
    useState(false);

  // Custom hooks
  const { logs, appendLog, clearLogs } = useLogs();
  const {
    connection,
    connectionState,
    errorMessage,
    setErrorMessage,
    connect,
    disconnect,
  } = useSignalRConnection({ onLog: appendLog });

  // Set up incoming message listeners
  useIncomingMessages({ connection, onLog: appendLog });

  const { connectionHistory, addToHistory, deleteFromHistory } =
    useConnectionHistory();
  const {
    methodHistory,
    addToMethodHistory,
    deleteMethodHistory,
    deleteAllMethodHistory,
    deleteMethodHistoryForConnection,
  } = useMethodHistory();
  const {
    args,
    addArg,
    removeArg,
    updateArgType,
    updateArgValue,
    resetArgs,
    setArgsFromHistory,
  } = useMethodArgs();

  const canSkipNegotiation = transport === "webSockets";

  const handleTransportChange = useCallback((value: TransportKey) => {
    setTransport(value);
    if (value !== "webSockets") {
      setSkipNegotiation(false);
    }
  }, []);

  const handleConnect = useCallback(async () => {
    const trimmedHubUrl = hubUrl.trim();
    setHubUrl(trimmedHubUrl);

    const effectiveSkipNegotiation = skipNegotiation && canSkipNegotiation;
    const success = await connect({
      hubUrl: trimmedHubUrl,
      transport,
      useToken,
      token,
      withCredentials,
      skipNegotiation: effectiveSkipNegotiation,
    });

    if (success) {
      // Save connection settings to history
      addToHistory({
        url: trimmedHubUrl,
        useToken,
        token: useToken ? token.trim() : "",
        transport,
        withCredentials,
        skipNegotiation: effectiveSkipNegotiation,
        lastConnected: new Date().toLocaleString(),
      });
    }
  }, [
    connect,
    hubUrl,
    transport,
    useToken,
    token,
    withCredentials,
    skipNegotiation,
    canSkipNegotiation,
    addToHistory,
  ]);

  const handleDisconnect = useCallback(() => disconnect(), [disconnect]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!connection || connectionState !== "connected") {
        setErrorMessage("Please establish a SignalR connection first.");
        return;
      }

      const trimmedMethod = methodName.trim();
      if (!trimmedMethod) {
        setErrorMessage("Please enter the server method name.");
        return;
      }

      setErrorMessage(null);

      let builtArgs: unknown[] = [];
      try {
        builtArgs = buildArgs(args);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setErrorMessage(message);
        return;
      }

      setIsSending(true);
      appendLog({
        kind: "request",
        method: trimmedMethod,
        payload: builtArgs,
        message: "Request sent.",
      });

      try {
        const response = await invokeHubMethod(
          connection,
          trimmedMethod,
          builtArgs
        );
        appendLog({
          kind: "response",
          method: trimmedMethod,
          payload: response,
          message: "Response received.",
        });

        // Save method to history on successful invocation
        addToMethodHistory(hubUrl.trim(), {
          methodName: trimmedMethod,
          args: args.map((arg) => ({ ...arg })),
          timestamp: new Date().toLocaleString(),
        });
        resetArgs();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        appendLog({
          kind: "error",
          method: trimmedMethod,
          message: `Invocation failed: ${message}`,
        });
        setErrorMessage(`Invocation failed: ${message}`);
      } finally {
        setIsSending(false);
      }
    },
    [
      connection,
      connectionState,
      methodName,
      args,
      hubUrl,
      appendLog,
      setErrorMessage,
      addToMethodHistory,
      resetArgs,
    ]
  );

  const handleSelectHistory = useCallback(
    async (item: ConnectionHistory) => {
      // Disconnect current connection if active
      if (connection && connectionState !== "disconnected") {
        await disconnect();
      }

      // Load new connection settings
      setHubUrl(item.url);
      setUseToken(item.useToken);
      setToken(item.token);
      setTransport(item.transport);
      setWithCredentials(item.withCredentials);
      setSkipNegotiation(item.skipNegotiation);

      // Clear Invoke Server Method inputs
      setMethodName("");
      resetArgs();
    },
    [connection, connectionState, disconnect, resetArgs]
  );

  const handleDeleteHistory = useCallback(
    (url: string) => {
      deleteFromHistory(url);
      deleteMethodHistoryForConnection(url);
    },
    [deleteFromHistory, deleteMethodHistoryForConnection]
  );

  const handleSelectMethodHistory = useCallback(
    (item: MethodHistoryItem) => {
      setMethodName(item.methodName);
      setArgsFromHistory(item.args);
    },
    [setArgsFromHistory]
  );

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-32 pt-10">
  <h1 className="text-3xl font-bold">SignalR Testing Tool</h1>

        <ConnectionSettings
          hubUrl={hubUrl}
          onHubUrlChange={setHubUrl}
          useToken={useToken}
          onUseTokenChange={setUseToken}
          token={token}
          onTokenChange={setToken}
          transport={transport}
          transportOptions={transportOptions}
          onTransportChange={handleTransportChange}
          withCredentials={withCredentials}
          onWithCredentialsChange={setWithCredentials}
          skipNegotiation={skipNegotiation}
          canSkipNegotiation={canSkipNegotiation}
          onSkipNegotiationChange={setSkipNegotiation}
          connectionState={connectionState}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          errorMessage={errorMessage}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
        />

        <InvokeServerMethod
          methodName={methodName}
          onMethodNameChange={setMethodName}
          args={args}
          onAddArg={addArg}
          onRemoveArg={removeArg}
          onArgTypeChange={updateArgType}
          onArgValueChange={updateArgValue}
          onSubmit={handleSubmit}
          isSending={isSending}
          connectionState={connectionState}
          onOpenHistory={() => setIsMethodHistoryModalOpen(true)}
        />

        <RequestResponsePool logs={logs} onClear={clearLogs} />

        <ConnectionHistoryModal
          isOpen={isHistoryModalOpen}
          history={connectionHistory}
          currentHubUrl={hubUrl.trim()}
          onClose={() => setIsHistoryModalOpen(false)}
          onSelect={handleSelectHistory}
          onDelete={handleDeleteHistory}
        />

        <MethodHistoryModal
          isOpen={isMethodHistoryModalOpen}
          methodHistory={methodHistory}
          currentHubUrl={hubUrl.trim()}
          onClose={() => setIsMethodHistoryModalOpen(false)}
          onSelect={handleSelectMethodHistory}
          onDelete={deleteMethodHistory}
          onDeleteAll={deleteAllMethodHistory}
        />
      </div>
      <footer className="w-full border-t border-slate-300 bg-slate-100 py-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-end px-6 text-sm">
          <a
            href="https://github.com/yrw9281/tool-signalr-client"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-700 transition hover:text-indigo-600"
          >
            <img src={githubIcon} alt="GitHub" className="h-5 w-5" />
            <span className="font-semibold">GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
