import { useSpring, animated } from "@react-spring/web"
import { useEffect, useState } from "react"
import { symbols } from "~/components/GameSymbols"

function Symbol({ symbol }: { symbol: React.ReactNode }) {
  const [position, setPosition] = useState({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    dx: (Math.random() - 0.5) * 5, // Random direction and speed (-2.5 to 2.5)
    dy: (Math.random() - 0.5) * 5,
  })

  const [{ x, y, rotation }, api] = useSpring(() => ({
    x: position.x,
    y: position.y,
    rotation: Math.random() * 360,
    config: { duration: 100 }, // Shorter duration for smoother movement
  }))

  useEffect(() => {
    const moveSymbol = () => {
      setPosition(prev => {
        let newX = prev.x + prev.dx
        let newY = prev.y + prev.dy
        let newDx = prev.dx
        let newDy = prev.dy

        // Bounce off edges
        if (newX <= 0 || newX >= window.innerWidth) {
          newDx = -newDx
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          newDy = -newDy
        }

        // Keep within bounds
        newX = Math.max(0, Math.min(window.innerWidth, newX))
        newY = Math.max(0, Math.min(window.innerHeight, newY))

        api.start({
          x: newX,
          y: newY,
          rotation: rotation.get() + 1, // Continuous slow rotation
        })

        return {
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy,
        }
      })
    }

    const animationFrame = setInterval(moveSymbol, 16) // ~60fps
    return () => clearInterval(animationFrame)
  }, [api, rotation])

  return (
    <animated.div
      style={{
        position: "absolute",
        fontSize: "2rem",
        x,
        y,
        rotate: rotation.to((r) => `${r}deg`),
        zIndex: 10,
      }}
    >
      {symbol}
    </animated.div>
  )
}

export function FlyingSymbols() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <>
      {symbols.map((symbol, index) => (
        <Symbol 
          key={index} 
          symbol={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width={24 + Math.random() * 48} 
              height={24 + Math.random() * 48} 
              fill={symbol.color}
            >
              <path d={symbol.d} />
            </svg>
          } 
        />
      ))}
    </>
  )
}

