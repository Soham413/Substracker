import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
    const clientIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    try {
        const decision = await aj.protect(req, { requested: 1 });
        // console.log("Arcjet decision", decision);
        // console.log("Detection reason:", decision.reason);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: "Too Many Requests" })

            else if (decision.reason.isBot()) return res.status(403).json({ error: "Bot detected" })

            else return res.status(403).json({ error: "Access denied" })
        }
        next()
    } catch (error) {
        console.log(`Arcjet middleware error: ${error}`);
        next(error);
    }

}