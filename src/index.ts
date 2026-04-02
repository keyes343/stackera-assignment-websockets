import { Request, Response } from "express";
import "module-alias/register";
import { router } from "./router";
import { app } from "./app";
import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { latestPrices, mapBinanceStream } from "./helperFunctions";
import { rateLimitMiddleware } from "./services/rateLimiter";

app.use(router);
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });
// "wss://stream.binance.com:9443/ws/btcusdt@ticker",
const binanceWS = new WebSocket(
  "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/bnbusdt@ticker",
);

const port = 5000;
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server running");
});

// WEBSOCKETS

// CODEBLOCK -- Binance
binanceWS.on("open", function open() {
  console.log("connected");
});

binanceWS.on("message", function message(data) {
  const parsed = JSON.parse(data.toString());
  const formatted = mapBinanceStream(parsed);

  latestPrices[formatted.symbol] = formatted;

  console.log("received: %s", parsed);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(formatted));
    }
  });
});

// CODEBLOCK -- Client
wss.on("connection", async function connection(clientSocket, req) {
  const ipHeader = req.headers["x-forwarded-for"];

  const ip = Array.isArray(ipHeader)
    ? ipHeader[0]
    : ipHeader?.split(",")[0] || req.socket.remoteAddress || "unknown";

  try {
    const limitChecker = await rateLimitMiddleware(ip as string);

    if (limitChecker) {
      clientSocket.send(JSON.stringify({ error: limitChecker }));
      clientSocket.close();
      return;
    }

    console.log("Client connected:", ip);

    clientSocket.on("message", function message(data) {
      console.log("received: %s", data);
    });
    clientSocket.send("something");
  } catch (error) {
    console.error("Rate limiter error:", error);
    clientSocket.close();
  }
});

console.log("ran 1");

server.listen(8000, async () => {
  console.log("hi there");
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
server.on("upgrade", (req) => {
  console.log("Upgrade request received:", req.url);
});

export const handler = app;
