import { useParams } from "@remix-run/react"

export default function PlayerScreen() {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Player {id}</h1>
      <p>Welcome to the game! Wait for the host to start.</p>
    </div>
  )
}

