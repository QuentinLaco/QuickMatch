import { z } from "zod";
import type {
  ActorKitSystemEvent,
  WithActorKitEvent,
  WithActorKitInput,
  BaseActorKitEvent,
} from "actor-kit";
import type { Env } from "~/env";

// Shared Types
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number(),
  connected: z.boolean(),
});

export const CardSchema = z.object({
  id: z.string(),
  symbols: z.array(z.string()),
});

// Client Events
export const GameClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("client.NEW_GAME"),
    hostId: z.string(),
    hostName: z.string(),
    config: z.object({
      minPlayers: z.number(),
      maxPlayers: z.number(),
      symbolsPerCard: z.number(),
    }),
  }),
  z.object({
    type: z.literal("client.ADD_PLAYER"),
    playerId: z.string(),
    playerName: z.string(),
  }),
  z.object({
    type: z.literal("client.REMOVE_PLAYER"),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal("client.END_GAME"),
  }),
]);

// Service Events
export const GameServiceEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("service.GAME_CREATED"),
    gameId: z.string(),
    config: z.object({
      minPlayers: z.number(),
      maxPlayers: z.number(),
      symbolsPerCard: z.number(),
    }),
  }),
  z.object({
    type: z.literal("service.PLAYER_ADDED"),
    player: PlayerSchema,
  }),
  z.object({
    type: z.literal("service.PLAYER_REMOVED"),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal("service.GAME_ENDED"),
  }),
]);

// Input Props
export const GameInputPropsSchema = z.object({
  minPlayers: z.number(),
  maxPlayers: z.number(),
  symbolsPerCard: z.number(),
});

// Types
export type GameClientEvent = z.infer<typeof GameClientEventSchema>;
export type GameServiceEvent = z.infer<typeof GameServiceEventSchema>;
export type GameInputProps = z.infer<typeof GameInputPropsSchema>;
export type GameInput = WithActorKitInput<GameInputProps, Env>;

export type GameEvent = BaseActorKitEvent<Env> & (
  | WithActorKitEvent<GameClientEvent, "client">
  | WithActorKitEvent<GameServiceEvent, "service">
  | ActorKitSystemEvent
);

// Context Types
export type GamePublicContext = {
  id: string;
  config: {
    minPlayers: number;
    maxPlayers: number;
    symbolsPerCard: number;
  };
  players: Array<z.infer<typeof PlayerSchema>>;
  startedAt?: number;
  finishedAt?: number;
};

export type GameServerContext = {
  public: GamePublicContext;
  private: Record<string, never>;
};
