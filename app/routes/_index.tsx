import { Link } from "@remix-run/react"
import { FlyingSymbols } from "~/components/FlyingSymbols"

export default function Index() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      <FlyingSymbols />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
        <h1 className="mb-4 text-6xl font-bold tracking-tight">Quick Match</h1>
        <p className="mb-8 text-xl">A fun game for the whole family</p>
        <div className="space-x-4">
          <Link
            to="/game-setup"
            className="rounded-full bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
          >
            Start Game
          </Link>
          <Link
            to="/settings"
            className="rounded-full bg-yellow-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-yellow-600"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

