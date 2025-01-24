import { ActorKitStateMachine } from "actor-kit";
import { assign, setup } from "xstate";
import type {
  GameEvent,
  GameInput,
  GameServerContext,
  GamePublicContext,
} from "~/schemas/game.schema";

export const gameMachine = setup({
  types: {
    context: {} as GameServerContext,
    events: {} as GameEvent,
    input: {} as GameInput,
  },
  actions: {
    addPlayer: assign({
      public: ({ context, event }) => {
        if (event.type !== "client.ADD_PLAYER") return context.public;
        return {
          ...context.public,
          players: [
            ...context.public.players,
            {
              id: event.playerId,
              name: event.playerName,
              score: 0,
              connected: true,
            },
          ],
        };
      },
    }),
    removePlayer: assign({
      public: ({ context, event }) => {
        if (event.type !== "client.REMOVE_PLAYER") return context.public;
        return {
          ...context.public,
          players: context.public.players.filter((p) => p.id !== event.playerId),
        };
      },
    }),
    setStartTime: assign({
      public: ({ context }) => ({
        ...context.public,
        startedAt: Date.now(),
      }),
    }),
    setFinishTime: assign({
      public: ({ context }) => ({
        ...context.public,
        finishedAt: Date.now(),
      }),
    }),
  },
  guards: {
    canAddPlayer: ({ context }) => {
      return context.public.players.length < context.public.config.maxPlayers;
    },
  },
}).createMachine({
  id: "game",
  initial: "initializing",
  context: ({ input }) => ({
    public: {
      id: input.actorId,
      config: {
        minPlayers: input.minPlayers,
        maxPlayers: input.maxPlayers,
        symbolsPerCard: input.symbolsPerCard,
      },
      players: [],
    },
  }),
  states: {
    initializing: {
      on: {
        "client.NEW_GAME": {
          target: "waitingForPlayers",
          actions: ({ context }) => ({
            type: "GAME_CREATED",
            gameId: context.public.id,
            config: context.public.config,
          }),
        },
      },
    },
    waitingForPlayers: {
      on: {
        "client.ADD_PLAYER": {
          guard: "canAddPlayer",
          actions: [
            "addPlayer",
            ({ context, event }) => {
              const player = context.public.players.find(
                (p) => p.id === event.playerId
              );
              if (!player) return;
              return {
                type: "PLAYER_ADDED",
                player,
              };
            },
          ],
        },
        "client.REMOVE_PLAYER": {
          actions: [
            "removePlayer",
            ({ event }: { event: GameEvent }) => ({
              type: "service.PLAYER_REMOVED",
              playerId: event.type === "client.REMOVE_PLAYER" ? event.playerId : "",
            }),
          ],
        },
        "client.END_GAME": {
          target: "finished",
          actions: [
            "setFinishTime",
            () => ({
              type: "service.GAME_ENDED"
            }),
          ],
        },
      },
    },
    finished: {
      type: "final",
    },
  },
}) satisfies ActorKitStateMachine<GameEvent, GameInput, GameServerContext>; 