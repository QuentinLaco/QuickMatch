import type { DurableObjectNamespace } from "@cloudflare/workers-types"
import type { ActorServer } from "actor-kit";
import type { Remix } from "./remix.server";

export interface Env {
  REMIX: DurableObjectNamespace<Remix>;
  ACTOR_KIT_SECRET: string;
  ACTOR_KIT_HOST: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_COOKIE_KEY: string;
  REFRESH_TOKEN_COOKIE_KEY: string;
  [key: string]: DurableObjectNamespace<ActorServer<any>> | unknown;
}