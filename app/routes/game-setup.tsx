import { useState } from "react"
import { Form } from "@remix-run/react"
import { QRCodeSVG } from 'qrcode.react'
import { ClientOnly } from "~/components/ClientOnly"

export default function GameSetupRoute() {
  const [playerCount, setPlayerCount] = useState(4)

  const decrementPlayers = () => {
    if (playerCount > 2) setPlayerCount(count => count - 1)
  }

  const incrementPlayers = () => {
    if (playerCount < 8) setPlayerCount(count => count + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <h1 className="text-6xl font-bold mb-6 text-center tracking-tight">Game Setup</h1>
      <Form method="post" className="mb-12 max-w-md mx-auto">
        <label htmlFor="playerCount" className="block mb-6 text-xl text-center">
          Number of Players:
        </label>
        <div className="flex items-center justify-center gap-6 mb-12">
          <button
            type="button"
            onClick={decrementPlayers}
            className="w-16 h-16 text-4xl font-bold bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            -
          </button>
          <div className="w-24 h-16 flex items-center justify-center text-3xl font-bold border-4 border-white/20 rounded-xl bg-white/10">
            {playerCount}
          </div>
          <button
            type="button"
            onClick={incrementPlayers}
            className="w-16 h-16 text-4xl font-bold bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            +
          </button>
        </div>
        <button 
          type="submit" 
          className="w-full mx-auto block bg-green-500 text-white px-8 py-3 rounded-full text-xl font-semibold hover:bg-green-600 transition-colors"
        >
          Start Game
        </button>
      </Form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {Array.from({ length: playerCount }).map((_, index) => (
          <div key={index} className="flex flex-col items-center text-center bg-white/10 p-6 rounded-xl">
            <ClientOnly>
              {() => {
                const playerUrl = `${window.location.origin}/player/${index + 1}`
                return <QRCodeSVG value={playerUrl} className="mb-4" size={128} />
              }}
            </ClientOnly>
            <p className="text-lg font-semibold">Player {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 