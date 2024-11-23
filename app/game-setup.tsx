'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dynamic from 'next/dynamic'

const Game = dynamic(() => import('./game'), { ssr: false })

export function GameSetup() {
  const [numPlayers, setNumPlayers] = useState('')
  const [gameTime, setGameTime] = useState('')
  const [gameStarted, setGameStarted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(numPlayers) > 1 && parseInt(gameTime) > 0) {
      setGameStarted(true)
    }
  }

  const handleReset = () => {
    setGameStarted(false)
    setNumPlayers('')
    setGameTime('')
  }

  if (gameStarted) {
    return <Game numPlayers={parseInt(numPlayers)} gameTime={parseInt(gameTime)} onReset={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto px-4">
      <div>
        <Label htmlFor="numPlayers" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Players
        </Label>
        <Input
          type="number"
          id="numPlayers"
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
          min="2"
          required
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="gameTime" className="block text-sm font-medium text-gray-700 mb-1">
          Game Time (minutes)
        </Label>
        <Input
          type="number"
          id="gameTime"
          value={gameTime}
          onChange={(e) => setGameTime(e.target.value)}
          min="1"
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">Start Game</Button>
    </form>
  )
}
