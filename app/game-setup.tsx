'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Game from './game'

export function GameSetup() {
  const [numPlayers, setNumPlayers] = useState('')
  const [gameStarted, setGameStarted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(numPlayers) > 1) {
      setGameStarted(true)
    }
  }

  const handleReset = () => {
    setGameStarted(false)
    setNumPlayers('')
  }

  if (gameStarted) {
    return <Game numPlayers={parseInt(numPlayers)} onReset={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="numPlayers" className="block text-sm font-medium text-gray-700">
          Number of Players
        </label>
        <Input
          type="number"
          id="numPlayers"
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
          min="2"
          required
          className="mt-1"
        />
      </div>
      <Button type="submit">Start Game</Button>
    </form>
  )
}
