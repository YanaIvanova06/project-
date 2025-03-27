"use client"

import { motion } from "framer-motion"
import type { Bank, MortgageProgram } from "@/types/mortgage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { AlertCircle } from "lucide-react"

interface BankCardProps {
  bank: Bank
  program: MortgageProgram
  onSelect: (bank: Bank, program: MortgageProgram) => void
}

export function BankCard({ bank, program, onSelect }: BankCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <Image src={bank.logo || "/placeholder.svg"} alt={bank.name} fill className="object-contain" />
            </div>
            <div>
              <CardTitle>{bank.name}</CardTitle>
              <CardDescription>{program.name}</CardDescription>
            </div>
          </div>
          <Badge
            variant={program.type === "family" ? "default" : program.type === "it" ? "secondary" : "outline"}
            className="w-fit"
          >
            {program.type === "family"
              ? "Семейная ипотека"
              : program.type === "it"
                ? "IT-специалистам"
                : "Стандартная ипотека"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ставка</span>
              <span className="font-medium">
                от {program.minRate}%{program.maxRate !== program.minRate && ` до ${program.maxRate}%`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Сумма</span>
              <span className="font-medium">до {formatCurrency(program.maxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Первый взнос</span>
              <span className="font-medium">от {program.minInitialPayment}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Срок</span>
              <span className="font-medium">до {program.term.max / 12} лет</span>
            </div>
          </div>
          {program.additionalInfo && program.additionalInfo.length > 0 && (
            <div className="rounded-md bg-muted p-3 text-sm space-y-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {program.additionalInfo.map((info, index) => (
                    <p key={index} className="text-muted-foreground">
                      {info}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Button className="w-full" onClick={() => onSelect(bank, program)}>
            Рассчитать
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

