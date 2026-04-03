import { Request, Response } from "express";
import "module-alias/register";
import { router } from "./router";
import { app } from "./app";
import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import {
  FormattedTicker,
  latestPrices,
  mapBinanceStream,
} from "./helperFunctions";
import { rateLimitMiddleware } from "./services/rateLimiter";

app.use(router);
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });
const port = 8000;

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// 1.     Setting up message queues
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
const messageQueue: FormattedTicker[] = [];
function processQueue() {
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();

    if (!message) continue;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
setInterval(processQueue, 100);

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// 2.   Connecting to BINANCE WEBSOCKETS
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------

let reconnectDelay = 1000; // start with 1 sec
let binanceWS: WebSocket | null = null;

// This 'reconnect' function is called when the connection to 'binanceWS' drops
function reconnect() {
  console.info(`Reconnecting in ${reconnectDelay}ms...`);
  if (binanceWS && binanceWS.readyState === WebSocket.OPEN) {
    return;
  }

  setTimeout(() => {
    reconnectDelay = Math.min(reconnectDelay * 2, 30000); // max 30 sec
    connectToBinance();
  }, reconnectDelay);
}

// This 'connectToBinance' function holds the logic to connect to 'binanceWS'
function connectToBinance() {
  console.info("Connecting to Binance...");
  binanceWS = new WebSocket(
    "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/bnbusdt@ticker",
  );
  // CODEBLOCK -- Binance
  binanceWS.on("open", function open() {
    console.info("connected");
  });

  binanceWS.on("message", function message(data) {
    const parsed = JSON.parse(data.toString());
    const formatted = mapBinanceStream(parsed);

    latestPrices[formatted.symbol] = formatted;
    messageQueue.push(formatted);
  });

  binanceWS.on("close", () => {
    console.info("Binance connection closed");
    reconnect();
  });

  binanceWS.on("error", (err) => {
    console.info("Binance error:", err.message);
    binanceWS?.close(); // triggers reconnect
  });
}

connectToBinance();

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// 3.      Connecting to CLIENTS
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
wss.on("connection", async function connection(clientSocket, req) {
  const ipHeader = req.headers["x-forwarded-for"];

  const ip = Array.isArray(ipHeader)
    ? ipHeader[0]
    : ipHeader?.split(",")[0] || req.socket.remoteAddress || "unknown";

  try {
    const limitChecker = await rateLimitMiddleware(ip as string);

    if (limitChecker.limited) {
      clientSocket.send(JSON.stringify({ error: limitChecker }));
      clientSocket.close();
      return;
    }

    console.info("Client connected:", ip);

    clientSocket.on("message", function message(data) {
      console.info("received: %s", data);
    });
    clientSocket.send("something");
  } catch (error) {
    console.error("Rate limiter error:", error);
    clientSocket.close();
  }
});

server.listen(port, async () => {
  console.log("hi there");
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export const handler = app;
