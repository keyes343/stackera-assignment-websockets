import Redis, { RedisOptions } from "ioredis";
import "dotenv/config";

const IOREDIS_HOST = process.env.IOREDIS_HOST;
// const IOREDIS_HOST = "";
// const TIMEOUT = process.env.IOREDIS_CONNECT_TIMEOUT
const TIMEOUT = 1000;

// Helper to create and configure a Redis client with sensible defaults
function createRedisClient() {
  if (!IOREDIS_HOST)
    throw new Error("IOREDIS_HOST is not defined in environment variables");

  const options: RedisOptions = {
    // allow long-running commands, sensible reconnect behavior
    connectTimeout: Number(process.env.IOREDIS_CONNECT_TIMEOUT) || 10000,
    maxRetriesPerRequest: null, // delegate retry to retryStrategy
    retryStrategy: (times: number) => Math.min(times * 50, 2000),
    enableReadyCheck: true,
  };

  // IOREDIS_HOST may be a full connection string (redis://...) or just host:port
  const client = new Redis(IOREDIS_HOST, options);

  // Attach listeners to avoid unhandled 'error' events and to aid debugging
  client.on("error", (err) => {
    console.error("[ioredis] error:", err && err.message ? err.message : err);
  });
  client.on("connect", () => console.log("[ioredis] connect"));
  client.on("ready", () => console.log("[ioredis] ready"));
  client.on("close", () => console.warn("[ioredis] close"));
  client.on("reconnecting", (delay: number) =>
    console.log("[ioredis] reconnecting in", delay, "ms"),
  );
  client.on("end", () => console.log("[ioredis] connection ended"));

  return client;
}

// Singleton pattern to ensure only one instance of Redis client is created
export class RedisSingleton {
  private static instance: Redis | null = null;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisSingleton.instance) {
      console.log("Creating new Redis client instance");
      RedisSingleton.instance = createRedisClient();
    } else {
      // console.log("Using existing Redis client instance");
    }
    return RedisSingleton.instance;
  }
}

export const redisClient = RedisSingleton.getInstance();
export const connectToRedis = async () => {
  try {
    await redisClient.ping();
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error(
      "Error connecting to Redis:",
      error && (error as Error).message ? (error as Error).message : error,
    );
  }
};
