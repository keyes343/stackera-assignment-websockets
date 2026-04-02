import { redisClient } from "@src/config/redis";

export const rateLimitMiddleware = async (ipAddress: string) => {
  const key = `rate_limit:${ipAddress}`;

  const payload = {
    limited: false,
    message: "",
  };

  try {
    const currentCount = await redisClient.incr(key);

    if (currentCount === 1) {
      await redisClient.expire(key, 60 * 10); // 10 min
    }

    if (currentCount > 10) {
      payload.limited = true;
      payload.message = "Too many requests";
    }
  } catch (err) {
    payload.limited = true;
    payload.message = "Rate limit check failed - Internal server error";
  } finally {
    return payload;
  }
};
