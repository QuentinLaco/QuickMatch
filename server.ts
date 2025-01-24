import { logDevReady } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import { createActorKitRouter } from "actor-kit/worker";
import { WorkerEntrypoint } from "cloudflare:workers";
import type { Env } from "./app/env";
import { Game } from "./app/servers/game.server";
import { Remix } from "./app/remix.server";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (process.env.NODE_ENV === "development") {
    logDevReady(build);
}

const router = createActorKitRouter<Env>(["game"]);

export { Game, Remix };

export default class Worker extends WorkerEntrypoint<Env> {
  fetch(request: Request): Promise<Response> | Response {
    if (request.url.includes("/api/")) {
      return router(request, this.env, this.ctx);
    }

    const id = this.env.REMIX.idFromName("default");
    return this.env.REMIX.get(id).fetch(request);
  }
}