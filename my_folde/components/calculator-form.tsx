"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Bank, MortgageProgram, MortgageResults } from "@/types/mortgage"

const formSchema = z.object({
  bankName: z.string().optional(),
  loanAmount: z.string().min(1, "Введите сумму кредита"),
  interestRate: z.string().min(1, "Введите процентную ставку"),
  loanTerm: z.string().min(1, "Введите срок кредита"),
  downPayment: z.string().optional(),
  paymentType: z.enum(["annuity", "differential"]),
})

interface CalculatorFormProps {
  selectedProgram: { bank: Bank; program: MortgageProgram } | null
  onCalculate: (results: MortgageResults) => void
  isCustom?: boolean
  initialValues?: MortgageResults | null
}

export function CalculatorForm({ selectedProgram, onCalculate, isCustom, initialValues }: CalculatorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      loanAmount: "",
      interestRate: selectedProgram ? String(selectedProgram.program.minRate) : "",
      loanTerm: "",
      downPayment: "",
      paymentType: "annuity",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при расчете ипотеки")
      }

      onCalculate(data)
    } catch (error) {
      console.error("Ошибка при расчете ипотеки:", error)
      setError(error instanceof Error ? error.message : "Произошла ошибка при расчете")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCustom
            ? "Другой банк"
            : selectedProgram
              ? `${selectedProgram.bank.name} - ${selectedProgram.program.name}`
              : "Параметры ипотеки"}
        </CardTitle>
        <CardDescription>
          {isCustom
            ? "Рассчитайте ипотеку для любого банка"
            : selectedProgram?.program.description || "Введите параметры для расчета"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isCustom && (
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название банка</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название банка" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма кредита</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Введите сумму кредита"
                      {...field}
                      max={selectedProgram?.program.maxAmount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Годовая процентная ставка (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Введите процентную ставку"
                      {...field}
                      min={selectedProgram?.program.minRate}
                      max={selectedProgram?.program.maxRate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Срок кредита (месяцев)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Введите срок кредита"
                      {...field}
                      min={selectedProgram?.program.term.min}
                      max={selectedProgram?.program.term.max}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Первоначальный взнос</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Введите первоначальный взнос" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип платежей</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип платежей" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annuity">Аннуитетный</SelectItem>
                      <SelectItem value="differential">Дифференцированный</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm font-medium text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Рассчитать
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

