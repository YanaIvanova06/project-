"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { MortgageResults } from "@/types/mortgage"
import { formatCurrency } from "@/lib/utils"
import { PartyPopper, TrendingDown } from "lucide-react"

interface MortgageChartsProps {
  results: MortgageResults
}

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  gradient: ["#ff6b6b", "#ffd93d", "#6bcb77"],
}

export function MortgageCharts({ results }: MortgageChartsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)

  if (!results) return null

  const principal = results.totalPayment - results.totalInterest
  const pieData = [
    {
      name: "Основной долг",
      value: principal,
      color: COLORS.primary,
    },
    {
      name: "Проценты",
      value: results.totalInterest,
      color: COLORS.secondary,
    },
  ]

  const totalAmount = principal + results.totalInterest
  const getPercentage = (value: number) => ((value / totalAmount) * 100).toFixed(1)

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} (${getPercentage(value)}%)`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border rounded-lg p-4 shadow-lg space-y-2"
        >
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-lg font-bold">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">{getPercentage(data.value)}% от общей суммы</p>
        </motion.div>
      )
    }
    return null
  }

  const getProgressColor = (progress: number) => {
    const index = Math.floor(progress * (COLORS.gradient.length - 1))
    return COLORS.gradient[index]
  }

  const maxBalance = results.schedule[0].balance
  const CustomAreaTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const progress = 1 - data.balance / maxBalance
      const month = data.month
      const isLastMonth = month === results.schedule.length

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border rounded-lg p-4 shadow-lg space-y-2"
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Месяц {month}</p>
            {isLastMonth && <PartyPopper className="h-4 w-4 text-yellow-500" />}
          </div>
          <p className="text-lg font-bold">{formatCurrency(data.balance)}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Прогресс:</span>
              <span className="font-medium">{(progress * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: getProgressColor(progress),
                }}
              />
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Структура платежей
            <span className="text-sm font-normal text-muted-foreground">
              (общая сумма: {formatCurrency(totalAmount)})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="value"
                  labelLine={true}
                  label={<CustomPieLabel />}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            График погашения
            <TrendingDown className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={results.schedule}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
                onMouseMove={(data) => {
                  if (data.activeTooltipIndex !== undefined) {
                    setHoveredMonth(data.activeTooltipIndex)
                  }
                }}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => `${value} мес`}
                  interval={Math.floor(results.schedule.length / 6)}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} width={100} />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.gradient[0]} stopOpacity={0.8} />
                    <stop offset="50%" stopColor={COLORS.gradient[1]} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={COLORS.gradient[2]} stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="Остаток долга"
                  stroke="url(#progressGradient)"
                  fill="url(#progressGradient)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomAreaTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

