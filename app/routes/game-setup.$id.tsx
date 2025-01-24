import { useParams } from "@remix-run/react"
import { GameActorKitContext, GameActorKitProvider } from "~/contexts/game.context"
import { useCallback, useState } from "react"
import type { PlayerSchema } from "~/schemas/game.schema";
import type { z } from "zod";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";
import { createAccessToken, createActorFetch } from "actor-kit/server";
import type { GameMachine } from "~/machines/game.machine";
import type { Env } from "~/env";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = context.env as Env;
  const fetchGameActor = createActorFetch<GameMachine>({
    actorType: "game",
    host: env.ACTOR_KIT_HOST,
  });

  const gameId = params.id;
  if (!gameId) {
    throw new Error("gameId is required");
  }

  const accessToken = await createAccessToken({
    signingKey: env.ACTOR_KIT_SECRET,
    actorId: gameId,
    actorType: "game",
    callerId: crypto.randomUUID(),
    callerType: "client",
  });

  const payload = await fetchGameActor({
    actorId: gameId,
    accessToken,
  });

  return json({
    gameId,
    accessToken,
    payload,
    host: env.ACTOR_KIT_HOST,
  });
}

function GameSetupContent() {
  const [playerName, setPlayerName] = useState("")
  const state = GameActorKitContext.useSelector(state => state);
  const send = GameActorKitContext.useSend();

  const handleAddPlayer = useCallback(async () => {
    if (!playerName.trim()) return

    await send({
      type: "client.ADD_PLAYER",
      playerId: crypto.randomUUID(),
      playerName: playerName.trim(),
    })

    setPlayerName("")
  }, [send, playerName])

  const handleRemovePlayer = useCallback(async (playerId: string) => {
    await send({
      type: "client.REMOVE_PLAYER",
      playerId,
    })
  }, [send])

  const players = state.public.players
  const config = state.public.config

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-6xl font-bold mb-6 text-center tracking-tight">Game Setup</h1>
        
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Player name"
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/50"
            />
            <button
              onClick={handleAddPlayer}
              disabled={players.length >= config.maxPlayers}
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Add Player
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((player: z.infer<typeof PlayerSchema>) => (
            <div key={player.id} className="bg-white/10 rounded-lg p-4 flex justify-between items-center">
              <span>{player.name}</span>
              <button
                onClick={() => handleRemovePlayer(player.id)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GameSetup() {
  const { gameId, accessToken, payload, host } = useLoaderData<typeof loader>();

  return (
    <GameActorKitProvider
      host={host}
      actorId={gameId}
      accessToken={accessToken}
      checksum={payload.checksum}
      initialSnapshot={payload.snapshot}
    >
      <GameSetupContent />
    </GameActorKitProvider>
  );
} 