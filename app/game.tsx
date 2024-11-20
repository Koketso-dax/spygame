'use client'

import { useReducer, useEffect } from 'react'
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

type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'REVEAL_PLAYER'; index: number }
  | { type: 'CLOSE_DIALOG' }

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

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME':
      const spyIndex = Math.floor(Math.random() * state.players.length)
      return {
        ...state,
        spyIndex,
        gameWord: words[Math.floor(Math.random() * words.length)],
        players: Array(state.players.length).fill(null).map((_, index) => ({
          revealed: false,
          isSpy: index === spyIndex
        })),
        openDialog: false,
        dialogContent: ''
      }
    case 'REVEAL_PLAYER':
      if (state.players[action.index].revealed) return state
      const newPlayers = [...state.players]
      newPlayers[action.index].revealed = true
      return {
        ...state,
        players: newPlayers,
        openDialog: true,
        dialogContent: state.players[action.index].isSpy ? "You are the spy!" : state.gameWord
      }
    case 'CLOSE_DIALOG':
      return { ...state, openDialog: false }
    default:
      return state
  }
}

export function Game({ numPlayers, onReset }: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, {
    players: Array(numPlayers).fill({ revealed: false, isSpy: false }),
    spyIndex: -1,
    gameWord: '',
    openDialog: false,
    dialogContent: ''
  })

  useEffect(() => {
    dispatch({ type: 'INIT_GAME' })
  }, [numPlayers])

  const handleReveal = (index: number) => {
    dispatch({ type: 'REVEAL_PLAYER', index })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Game in Progress</h2>
      <div className="grid grid-cols-3 gap-4">
        {state.players.map((player, index) => (
          <Dialog key={index} open={state.openDialog && player.revealed} onOpenChange={(open) => !open && dispatch({ type: 'CLOSE_DIALOG' })}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleReveal(index)}
                disabled={player.revealed}
                className="h-24 w-24"
              >
                {player.revealed ? (
                  <UserCheck className="h-12 w-12" />
                ) : (
                  <User className="h-12 w-12" />
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
      <Button onClick={onReset} className="mt-4">Reset Game</Button>
    </div>
  )
}
