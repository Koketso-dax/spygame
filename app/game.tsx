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
} from "@/components/ui/dialog"

interface GameProps {
  numPlayers: number
  onReset: () => void
}

type Player = { revealed: boolean; isSpy: boolean }
type GameState = {
  players: Player[]
  spyIndex: number
  gameWord: string
  openDialog: boolean
  dialogContent: string
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

export function Game({ numPlayers, onReset }: GameProps) {
  const [state, setState] = useState<GameState>({
    players: Array(numPlayers).fill({ revealed: false, isSpy: false }),
    spyIndex: -1,
    gameWord: '',
    openDialog: false,
    dialogContent: ''
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
      dialogContent: ''
    })
  }, [numPlayers])

  useEffect(() => {
    initGame()
  }, [initGame])

  const handleReveal = (index: number) => {
    if (state.players[index].revealed) return
    const newPlayers = [...state.players]
    newPlayers[index].revealed = true
    setState({
      ...state,
      players: newPlayers,
      openDialog: true,
      dialogContent: state.players[index].isSpy ? "You are the spy!" : state.gameWord
    })
  }

  const closeDialog = () => {
    setState(prevState => ({ ...prevState, openDialog: false }))
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-bold text-center">Game in Progress</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {state.players.map((player, index) => (
          <Dialog key={index} open={state.openDialog && player.revealed} onOpenChange={(open) => !open && closeDialog()}>
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
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <Button onClick={onReset} className="w-full mt-4">Reset Game</Button>
    </div>
  )
}