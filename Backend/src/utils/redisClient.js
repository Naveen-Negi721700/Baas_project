import { createClient } from "redis";

// true when Redis answered at startup. The rate limiters read this to choose their store.
export let redisReady = false;

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",

    // when Redis is down, fail fast instead of making every request wait
    disableOfflineQueue: true,

   socket: {
    connectTimeout: 10000,

    // Retry temporary connection failures
    reconnectStrategy: (retries) =>
        Math.min(retries * 500, 5000),
},
});

redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
});

// the rate limiters are created after this file finishes, so they know if Redis is ready
try {
    await redisClient.connect();
    redisReady = true;
    console.log("Redis connected");
} catch (error) {
    console.warn("Redis is not available, rate limits will use memory instead:", error.message);
}