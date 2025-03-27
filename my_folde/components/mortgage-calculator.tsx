"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Bank, MortgageProgram, MortgageResults as MortgageResultsType } from "@/types/mortgage"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankCard } from "./bank-card"
import { CalculatorForm } from "./calculator-form"
import { MortgageResults } from "./mortgage-results"
import { MortgageCharts } from "./mortgage-charts"
import { Button } from "@/components/ui/button"
import { Calculator, X } from "lucide-react"

interface MortgageCalculatorProps {
  banks: Bank[]
}

export default function MortgageCalculator({ banks }: MortgageCalculatorProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [showCustomCalculator, setShowCustomCalculator] = useState(false)
  const [results, setResults] = useState<MortgageResultsType | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<{ bank: Bank; program: MortgageProgram } | null>(null)

  const filteredPrograms = banks.flatMap((bank) =>
    bank.programs
      .filter((program) => activeTab === "all" || program.type === activeTab)
      .map((program) => ({ bank, program })),
  )

  const handleProgramSelect = (bank: Bank, program: MortgageProgram) => {
    setSelectedProgram({ bank, program })
    setResults(null)
  }

  const handleCustomCalculatorToggle = () => {
    setShowCustomCalculator(!showCustomCalculator)
    setSelectedProgram(null)
    setResults(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="all">Все программы</TabsTrigger>
            <TabsTrigger value="standard">Стандартная</TabsTrigger>
            <TabsTrigger value="family">Семейная</TabsTrigger>
            <TabsTrigger value="it">IT-специалистам</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant={showCustomCalculator ? "secondary" : "outline"}
          className="ml-4"
          onClick={handleCustomCalculatorToggle}
        >
          {showCustomCalculator ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Закрыть
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Другой банк
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="wait">
          {(showCustomCalculator || selectedProgram) && !results && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-xl">
                <CalculatorForm
                  selectedProgram={selectedProgram}
                  onCalculate={setResults}
                  isCustom={showCustomCalculator}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!results && !showCustomCalculator && (
            <motion.div
              key="programs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPrograms.map(({ bank, program }) => (
                <BankCard key={program.id} bank={bank} program={program} onSelect={handleProgramSelect} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <div className="space-y-6">
                <MortgageResults results={results} />
                <MortgageCharts results={results} />
              </div>
              <div className="lg:sticky lg:top-4">
                <CalculatorForm
                  selectedProgram={selectedProgram}
                  onCalculate={setResults}
                  isCustom={showCustomCalculator}
                  initialValues={results}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

