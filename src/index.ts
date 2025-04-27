import { fromHono } from "chanfana";
import { Hono } from "hono";

import { job } from "@/endpoints/jobs";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

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
