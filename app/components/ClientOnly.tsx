import { useEffect, useState, type ReactNode } from "react"

export function ClientOnly({ children }: { children: (() => ReactNode) | ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  
  return <>{typeof children === 'function' ? children() : children}</>
} 