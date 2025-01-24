import { z } from "zod";
import type {
  ActorKitSystemEvent,
  WithActorKitEvent,
  WithActorKitInput,
} from "actor-kit";
import type { Env } from "~/env";
import { CardSchema, PlayerSchema } from "./game.schema";

// Client Events
export const RoundClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("END_ROUND"),
  }),
  z.object({
    type: z.literal("START_ROUND"),
  }),
]);

// Service Events
export const RoundServiceEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ROUND_STARTED"),
    firstCard: CardSchema,
  }),
  z.object({
    type: z.literal("CARD_MATCHED"),
    playerId: z.string(),
    card: CardSchema,
  }),
  z.object({
    type: z.literal("DRAW_NEW_CENTER_CARD"),
    playerId: z.string(),
    card: CardSchema,
  }),
  z.object({
    type: z.literal("ROUND_ENDED"),
  }),
]);

// Input Props
export const RoundInputPropsSchema = z.object({
  symbolsPerCard: z.number(),
});

// Types
export type RoundClientEvent = z.infer<typeof RoundClientEventSchema>;
export type RoundServiceEvent = z.infer<typeof RoundServiceEventSchema>;
export type RoundInputProps = z.infer<typeof RoundInputPropsSchema>;
export type RoundInput = WithActorKitInput<RoundInputProps, Env>;

export type RoundEvent =
  | WithActorKitEvent<RoundClientEvent, "client">
  | WithActorKitEvent<RoundServiceEvent, "service">
  | ActorKitSystemEvent;

// Context Types
export type RoundPublicContext = {
  id: string;
  status: "playing" | "paused" | "finished";
  activeCard: z.infer<typeof CardSchema>;
  startedAt?: number;
  finishedAt?: number;
};

export type RoundPrivateContext = {
  deck: Array<z.infer<typeof CardSchema>>;
  lastAction: number;
};

export type RoundServerContext = {
  public: RoundPublicContext;
  private: RoundPrivateContext;
}; 