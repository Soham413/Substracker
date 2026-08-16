import arcjet, { tokenBucket, detectBot, shield } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

export const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"], // Track requests by IP
    rules: [
      // Shield protects your app from common attacks e.g. SQL injection
      shield({ mode: "LIVE" }),
      // Create a bot detection rule
      // Set detectBot to "DRY_RUN" so that real users behind proxies / mobile IPs are not falsely blocked on sign in / sign up
      detectBot({
        mode: "DRY_RUN",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:MONITOR",
          "CATEGORY:PREVIEW",
          "JAVASCRIPT_NODE_FETCH",
        ],
      }),
      // Token bucket rate limit to protect against brute-force attacks
      tokenBucket({
        mode: "LIVE",
        refillRate: 5,
        interval: 10,
        capacity: 10,
      }),
    ],
  });
