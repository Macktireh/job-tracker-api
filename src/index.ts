import { env } from "cloudflare:workers";
import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { job } from "@/endpoints/jobs";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: env.ALLOWED_ORIGINS,
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

// Setup OpenAPI registry
const openapi = fromHono(app, {
  redoc_url: "/",
  docs_url: "/swagger",
  openapi_url: "/openapi.json",
});

// Register Jobs endpoints
openapi.route("/api/jobs", job);

// Export the Hono app
export default app;
