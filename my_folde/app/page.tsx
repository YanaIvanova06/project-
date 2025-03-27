import MortgageCalculator from "@/components/mortgage-calculator"
import { banks } from "@/data/banks"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-7xl space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Калькулятор ипотеки</h1>
        <MortgageCalculator banks={banks} />
      </div>
    </main>
  )
}

