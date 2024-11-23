'use client'

import { useState, useCallback, useEffect } from 'react'
import { User, UserCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface GameProps {
  numPlayers: number
  gameTime: number
  onReset: () => void
}

type Player = { revealed: boolean; isSpy: boolean }
type GameState = {
  players: Player[]
  spyIndex: number
  gameWord: string
  openDialog: boolean
  dialogContent: string
  activePlayerIndex: number | null
  allRevealed: boolean
  timerStarted: boolean
  timeRemaining: number
  showInstructions: boolean
}

const words = ['Apple', 'Boat', 'Car', 'Date', 'Exit',
  'Fire', 'Garden', 'Happy', 'Ice', 'Jump',
  'Kite', 'Lemon', 'Moon', 'Night', 'Orange',
  'Pencil', 'Queen', 'Rain', 'Sun', 'Table',
  'Umbrella', 'Violin', 'Water', 'Xylophone', 'Yellow',
  'Zebra', 'Zoom', 'Yacht', 'Xenon', 'Wagon',
  'Violet', 'Umbrella', 'Tulip', 'Sushi', 'Star',
  'Snow', 'Soccer', 'Rocket', 'Rainbow', 'Puzzle',
  'Pirate', 'Owl', 'Ninja', 'Mushroom', 'Mango',
  'Lighthouse', 'Kangaroo', 'Jungle', 'Iceberg', 'Horse',
  'Guitar', 'Frog', 'Flower', 'Falcon', 'Eagle',
  'Dragon', 'Dolphin', 'Cupcake', 'Cactus', 'Butterfly',
  'Bicycle', 'Bee', 'Bear', 'Astronaut', 'Ant']

export default function Game({ numPlayers, gameTime, onReset }: GameProps) {
  const [state, setState] = useState<GameState>({
    players: Array(numPlayers).fill({ revealed: false, isSpy: false }),
    spyIndex: -1,
    gameWord: '',
    openDialog: false,
    dialogContent: '',
    activePlayerIndex: null,
    allRevealed: false,
    timerStarted: false,
    timeRemaining: gameTime * 60, // Convert minutes to seconds
    showInstructions: false
  })

  const initGame = useCallback(() => {
    const spyIndex = Math.floor(Math.random() * numPlayers)
    setState({
      spyIndex,
      gameWord: words[Math.floor(Math.random() * words.length)],
      players: Array(numPlayers).fill(null).map((_, index) => ({
        revealed: false,
        isSpy: index === spyIndex
      })),
      openDialog: false,
      dialogContent: '',
      activePlayerIndex: null,
      allRevealed: false,
      timerStarted: false,
      timeRemaining: gameTime * 60,
      showInstructions: false
    })
  }, [numPlayers, gameTime])

  useEffect(() => {
    initGame()
  }, [initGame])

  useEffect(() => {
    if (state.timerStarted && state.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1
        }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.timerStarted, state.timeRemaining])

  const handleReveal = (index: number) => {
    if (state.players[index].revealed) return
    const newPlayers = [...state.players]
    newPlayers[index].revealed = true
    const allRevealed = newPlayers.every(player => player.revealed)
    setState(prevState => ({
      ...prevState,
      players: newPlayers,
      openDialog: true,
      dialogContent: prevState.players[index].isSpy ? "You are the spy!" : prevState.gameWord,
      activePlayerIndex: index,
      allRevealed
    }))
  }

  const closePlayerDialog = () => {
    setState(prevState => {
      const allRevealed = prevState.players.every(player => player.revealed)
      return {
        ...prevState,
        openDialog: false,
        activePlayerIndex: null,
        showInstructions: allRevealed
      }
    })
  }

  const startTimer = () => {
    setState(prevState => ({ ...prevState, timerStarted: true, showInstructions: false }))
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-bold text-center">Game in Progress</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {state.players.map((player, index) => (
          <Dialog 
            key={index} 
            open={state.openDialog && state.activePlayerIndex === index}
            onOpenChange={(open) => {
              if (!open) {
                closePlayerDialog()
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => handleReveal(index)}
                disabled={player.revealed}
                className="w-full h-20 sm:h-24"
                aria-label={`Player ${index + 1}`}
              >
                {player.revealed ? (
                  <UserCheck className="h-8 w-8 sm:h-12 sm:w-12" />
                ) : (
                  <User className="h-8 w-8 sm:h-12 sm:w-12" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Word</DialogTitle>
                <DialogDescription>
                  {state.dialogContent}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <p className="text-sm text-muted-foreground">Close this dialog and pass the phone to another player</p>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <Dialog 
        open={state.showInstructions} 
        onOpenChange={(open) => setState(prevState => ({ ...prevState, showInstructions: open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Instructions</DialogTitle>
            <DialogDescription>
              Everyone has selected a role. The spy is among you, ask each other questions to determine who the spy could be then when you are ready, vote on who you think it might be. You have {gameTime} minutes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={startTimer} className="w-full">Start Timer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {state.timerStarted && (
        <div className="mt-6 text-center">
          <p className="text-2xl font-bold">Time Remaining: {formatTime(state.timeRemaining)}</p>
        </div>
      )}
      <Button onClick={onReset} className="w-full mt-4">Reset Game</Button>
    </div>
  )
}
