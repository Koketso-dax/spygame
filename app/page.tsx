import { GameSetup } from './game-setup'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Spy Game</h1>
      <GameSetup />
    </main>
  )
}
