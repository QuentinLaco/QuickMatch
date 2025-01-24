import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { GameActorKitProvider } from "~/contexts/game.context"

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation()
  const isGameRoute = location.pathname.includes('game')

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quick Match</title>
      </head>
      <body className={isGameRoute ? "min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white" : ""}>
        <GameActorKitProvider
          host={process.env.ACTOR_KIT_HOST ?? "127.0.0.1:8787"}
          actorId="game"
          checksum=""
          accessToken=""
          initialSnapshot={{
            public: {
              id: "",
              config: { minPlayers: 2, maxPlayers: 8, symbolsPerCard: 8 },
              players: []
            },
            private: {} as never,
            value: "initializing"
          }}
        >
          <Outlet />
        </GameActorKitProvider>
      </body>
    </html>
  )
}
