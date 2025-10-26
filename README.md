# SignalR Testing Tool

Single-page web client for testing Azure SignalR and ASP.NET Core SignalR hubs. The app lets you connect to a hub, invoke methods with custom payloads, and inspect incoming messages and request/response logs.

Try the [Live Tool](https://signalr.yrw.tw).

## Tech stack

- React 19 + TypeScript
- Vite build tooling
- Tailwind 4 utility classes
- @microsoft/signalr JavaScript client

## Project layout

```text
src/
  react-signalr-client/
    src/
      App.tsx
      components/
      hooks/
      services/
      storage/
      utils/
```

- `App.tsx` coordinates state for connection details, method invocation, logs, and modals.
- Hooks in `src/hooks` manage SignalR connection lifecycle, histories, logs, and payload args.
- `services/signalr.service.ts` creates the `HubConnection` and wraps `invokeHubMethod`.
- `storage/localStorage.ts` is the single source of truth for persisted history data.

## Prerequisites

- Node.js 20+
- npm 10+

## Local development

```bash
# install dependencies
npm install --prefix src/react-signalr-client

# start the dev server (http://localhost:5173)
npm run --prefix src/react-signalr-client dev

# type-check and build the production bundle
npm run --prefix src/react-signalr-client build

# lint the codebase
npm run --prefix src/react-signalr-client lint
```

## Docker

1. Build the Docker image:

   ```bash
   docker build -t signalr-testing-tool .
   ```

2. Run the container:

   ```bash
   docker run --rm -p 8080:80 signalr-testing-tool
   ```

3. Open `http://localhost:8080` in your browser.

The Dockerfile uses a multi-stage build: the app is built inside a Node.js 20 image and the static build output is served by Nginx.

## SignalR usage tips

- Trim hub URLs and tokens before connecting to avoid negotiation errors.
- Skip negotiation only when both browser and server support WebSockets.
- Build payloads with the provided UI; the app converts text, number, and JSON values before invoking hub methods.
- Use history modals to restore previous connection settings and method payloads.

## Connecting to Azure SignalR

- Call your hub server’s `negotiate` endpoint (for example `https://<your-app>/api/negotiate`) to fetch the negotiated connection details. A typical response looks like this:

   ```json
   {
      "negotiateVersion": 0,
      "url": "https://yrw-test.service.signalr.net/client/?hub=messagehub...",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjExMjc5Njk2NDgif...",
      "availableTransports": []
   }
   ```

- In the tool’s **Connection Settings**, paste the `url` into `Hub Address`, enable `Use token (Authorization header)`, and paste the `accessToken` into `Bearer Token`.
- Repeat the negotiate → paste flow whenever you need a new connection; Azure SignalR tokens expire and must be refreshed.
- Adjust `Transport`, `With Credentials`, and `Skip Negotiation` as needed—defaults usually work out of the box.

## Repository scripts reference

Inside `src/react-signalr-client/package.json`:

| Script  | Purpose                         |
| ------- | -------------------------------- |
| dev     | Start the Vite dev server       |
| build   | Run TypeScript build + Vite dist |
| lint    | Execute eslint over the project |
| preview | Serve the production build      |

## License

MIT
