import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { redisClient, redisReady } from "../utils/redisClient.js";

// every limiter gets its own store, so their counters never mix.
// If Redis is not available, "undefined" makes the limiter count in memory instead.
const makeStore = (name) =>
    redisReady
        ? new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix: `rl:${name}:`,
        })
        : undefined;

// the answer sent when someone is over the limit (same shape as your other errors)
const tooMany = (message) => (req, res) =>
    res.status(429).json({ success: false, statusCode: 429, message });

const baseOptions = {
    standardHeaders: "draft-7", // sends RateLimit headers, and Retry-After
    legacyHeaders: false,
    passOnStoreError: true,     // if Redis fails while running, let the request through
};

const byIp = (req) => ipKeyGenerator(req.ip);

// 1. Every API route: a wide limit that only stops obvious abuse
export const globalLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 600,
    store: makeStore("global"),
    keyGenerator: byIp,
    handler: tooMany("Too many requests. Please slow down and try again in a few minutes."),
});

// 2. Login: 10 failed attempts per 15 minutes for each IP (successful logins are not counted)
export const loginLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    store: makeStore("login"),
    keyGenerator: byIp,
    handler: tooMany("Too many login attempts. Please try again in 15 minutes."),
});

// 3. Signup: 5 new accounts per hour for each IP
export const signupLimiter = rateLimit({
    ...baseOptions,
    windowMs: 60 * 60 * 1000,
    limit: 5,
    store: makeStore("signup"),
    keyGenerator: byIp,
    handler: tooMany("Too many accounts created from this network. Please try again later."),
});

// 4. The AI assistant: 20 messages per hour for each user (every message uses your Gemini quota).
// Put it AFTER verifyJWT, so req.user exists.
export const aiLimiter = rateLimit({
    ...baseOptions,
    windowMs: 60 * 60 * 1000,
    limit: 20,
    store: makeStore("ai"),
    keyGenerator: (req) => (req.user?._id ? String(req.user._id) : ipKeyGenerator(req.ip)),
    handler: tooMany("You have used all your assistant messages for this hour. Please try again later."),
});

// 5. The public API that your users' apps call: 60 requests per minute for each API key.
// Put it AFTER the middleware that checks the API key, so only real keys are counted.
export const apiKeyLimiter = rateLimit({
    ...baseOptions,
    windowMs: 60 * 1000,
    limit: 60,
    store: makeStore("apikey"),
    keyGenerator: (req) => {
        const keyId = req.headers["x-api-key-id"];
        return typeof keyId === "string" && keyId ? `key:${keyId}` : ipKeyGenerator(req.ip);
    },
    handler: tooMany("API key rate limit reached (60 requests per minute). Please slow down."),
});