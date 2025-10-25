## Purpose

This repo holds a single-page SignalR client built with React + TypeScript + Vite. These notes give an AI agent the fast path to understanding structure, coding patterns, and safe refactors.

## Layout snapshot

- Frontend lives in `src/react-signalr-client`.
- Entry: `src/main.tsx` renders `App.tsx`.
- Hooks, services, storage helpers, and UI components sit under `src/`.

## Core flow

1. `App.tsx` owns all high-level state (connection settings, method form, logs, modal flags) and wires hooks/components together.
2. `useSignalRConnection` creates and manages the `HubConnection` via `createHubConnection` from `services/signalr.service.ts` and pushes lifecycle events to `onLog`.
3. `useIncomingMessages` attaches default listeners (`ReceiveMessage`, `SystemMessage`, `Notification`, `Update`, `Broadcast`) to the active connection and logs incoming payloads.
4. `useLogs` prepends log entries with generated ids + timestamps for display in `RequestResponsePool`.
5. `useConnectionHistory` / `useMethodHistory` mirror data to `localStorage` (`signalr-connection-history`, `signalr-method-history`) and feed the history modals.
6. `useMethodArgs` maintains the dynamic list of request parameters; `buildArgs` parses UI strings into the correct runtime values before `invokeHubMethod` executes on the live connection.

## Key files to skim

- `src/App.tsx` – orchestration, state transitions, guard rails before invoking hub methods.
- `src/hooks/useSignalRConnection.ts` – connection lifecycle, logging, reconnect handling.
- `src/services/signalr.service.ts` – only place that builds `HubConnection` and applies transport/token options.
- `src/utils/args.ts` – string-to-typed-args conversion (numbers, JSON, text).
- `src/storage/localStorage.ts` – persistence helpers and storage key definitions.
- `src/types.ts` – shared types (transport keys, log shape, history records).

## Patterns & conventions

- **Logging**: hooks/services call `onLog` with `LogEntry` minus `id`/`timestamp`; `useLogs` injects both before display. Log kinds: `system`, `request`, `response`, `error`, `incoming`.
- **Transport logic**: `constants.ts` maps `TransportKey` to `HttpTransportType`. Only set `skipNegotiation` when the selected transport is `webSockets`.
- **Tokens**: if `useToken` is true and `token.trim()` has content, `createHubConnection` configures `accessTokenFactory`. Otherwise no auth header is sent.
- **Arguments**: UI keeps args as strings; convert with `buildArgs` before invoking. Permit zero arguments by clearing the array (no implicit empty string).
- **Persistence**: never change storage keys without a migration. History hooks are the single source of truth for reading/writing localStorage.
- **IDs**: use `makeId()` (`crypto.randomUUID` fallback) for log entries, UI args, and new persisted records when uniqueness matters.

## When updating UI components

- Components live in feature folders (`components/connection`, `components/method`, `components/logs`, `components/modals`, `components/shared`). Each root `index.ts` re-exports defaults for barrel imports.
- Styling uses utility class strings in `styles.ts`. Keep consistency by extending those helpers instead of hardcoding new variants.
- Any new component props should be typed via `src/types.ts` or component-local interfaces to keep shared types discoverable.

## Safe extension tips

- Add new incoming hub handlers by extending `useIncomingMessages` (register + cleanup + log).
- Add new transport options by updating `TransportKey` union, `transportLabels`, `transportMap`, and exposing the option in both `ConnectionSettings` components.
- If adjusting persistence schema, teach `load*` helpers to read legacy data and migrate before returning.
- For cross-cutting logs or errors, thread the shared `onLog` callback rather than writing directly to UI state.

## Tooling & commands

Execute commands from `src/react-signalr-client`.

- `npm install` – install deps.
- `npm run dev` – Vite dev server.
- `npm run build` – `tsc -b` followed by `vite build`.
- `npm run preview` – serve production build.
- `npm run lint` – run eslint (config in `eslint.config.js`).

Example with repo root prefix: `npm --prefix src/react-signalr-client run dev`.

## Guardrails

- Do not alter `SignalRConnectionOptions` shape exposed by `createHubConnection` without coordinating updates to all callers.
- Keep storage keys (`signalr-connection-history`, `signalr-method-history`) stable unless you also ship a migration.
- Trim user input (hub URL, tokens, args) before persisting or invoking to avoid subtle server failures.
- Avoid mutating history arrays in-place; always create new objects so React state updates render correctly.

## Need more info?

Ask the maintainer for: preferred package manager, acceptance criteria for persistence migrations, or specifics about target hub methods (streaming, groups, etc.).

Happy hacking!
