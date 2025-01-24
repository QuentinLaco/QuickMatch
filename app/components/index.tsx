import { useState } from "react"
import { Form } from "@remix-run/react"
import QRCode from "qrcode.react"

export default function QuickMatchHomeScreen() {
  const [showGameSetup, setShowGameSetup] = useState(false)
  const [playerCount, setPlayerCount] = useState(4)

  const handleStartGame = () => {
    setShowGameSetup(true)
  }

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerCount(Number(e.target.value))
  }

  const generatePlayerUrl = (playerNumber: number) => {
    return `${typeof window !== "undefined" ? window.location.origin : ""}/player/${playerNumber}`
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6">QuickMatch</h1>
      <p className="mb-8">A fun game similar to Spot It! Play on a TV with your cellphones.</p>

      {!showGameSetup ? (
        <button onClick={handleStartGame} className="bg-blue-500 text-white px-6 py-3 rounded text-lg">
          Start Game
        </button>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Game Setup</h2>
          <Form method="post" className="mb-8">
            <label htmlFor="playerCount" className="block mb-2">
              Number of Players:
            </label>
            <input
              type="number"
              id="playerCount"
              name="playerCount"
              value={playerCount}
              onChange={handlePlayerCountChange}
              min="2"
              max="8"
              className="border rounded px-2 py-1 mb-4"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Generate QR Codes
            </button>
          </Form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(playerCount)].map((_, index) => (
              <div key={index} className="text-center">
                <QRCode value={generatePlayerUrl(index + 1)} size={128} />
                <p className="mt-2">Player {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

