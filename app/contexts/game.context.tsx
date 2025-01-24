"use client";

import type { GameMachine } from "~/machines/game.machine";
import { createActorKitContext } from "actor-kit/react";

const context = createActorKitContext<GameMachine>("game");
export const { Provider: GameActorKitProvider } = context;
export const GameActorKitContext = context; 