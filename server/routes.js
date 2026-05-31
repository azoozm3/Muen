import { routeRegistrars } from "./routes/registry.js";
import { prepareStorage, storage } from "./storage/index.js";
import { serverEnv } from "./config/app-env.js";

export async function registerRoutes(httpServer, app) {
  const context = { storage };

  for (const registerRoute of routeRegistrars) {
    registerRoute(app, context);
  }

  await prepareStorage(storage);

  return httpServer;
}
