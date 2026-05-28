// CONFIG //
import { environmentConfig } from "./config/environment.js";
// SERVICES //
import { app } from "./app.js";
// LIBRARIES //
import { serve } from "@hono/node-server";

serve({
  fetch: app.fetch,
  port: environmentConfig.port,
  hostname: "0.0.0.0",
});
