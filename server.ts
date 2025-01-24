import { DurableObjectNamespace } from "@cloudflare/workers-types";
import { AnyActorServer } from "actor-kit";
import { createActorKitRouter } from "actor-kit/worker";
import { WorkerEntrypoint } from "cloudflare:workers";
import { Game, GameServer } from "./app/servers/game.server";

interface Env {
  GAME: DurableObjectNamespace<GameServer>;
  REMIX: DurableObjectNamespace;
  ACTOR_KIT_SECRET: string;
  ACTOR_KIT_HOST: string;
  NODE_ENV: string;
  [key: string]: DurableObjectNamespace<AnyActorServer> | unknown;
}

const router = createActorKitRouter<Env>(["game"]);

export { Game };

export default class Worker extends WorkerEntrypoint<Env> {
  fetch(request: Request): Promise<Response> | Response {
    if (request.url.includes("/api/")) {
      return router(request, this.env, this.ctx);
    }

    const id = this.env.REMIX.idFromName("default");
    return this.env.REMIX.get(id).fetch(request);
  }
}