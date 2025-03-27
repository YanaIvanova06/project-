import { NextResponse } from "next/server"

function calculateAnnuityPayment(principal: number, rate: number, term: number) {
  const monthlyRate = rate / 12 / 100
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, term)
  const denominator = Math.pow(1 + monthlyRate, term) - 1
  return numerator / denominator
}

function calculateDifferentialPayment(principal: number, rate: number, term: number, month: number) {
  const monthlyRate = rate / 12 / 100
  const principalPayment = principal / term
  const remainingPrincipal = principal - principalPayment * (month - 1)
  const interestPayment = remainingPrincipal * monthlyRate
  return principalPayment + interestPayment
}

function calculateSchedule(principal: number, rate: number, term: number, paymentType: string) {
  const schedule = []
  let remainingBalance = principal
  let totalPayment = 0
  let totalInterest = 0

  if (paymentType === "annuity") {
    const monthlyPayment = calculateAnnuityPayment(principal, rate, term)
    for (let month = 1; month <= term; month++) {
      const interestPayment = remainingBalance * (rate / 12 / 100)
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance -= principalPayment

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      })

      totalPayment += monthlyPayment
      totalInterest += interestPayment
    }
  } else {
    for (let month = 1; month <= term; month++) {
      const payment = calculateDifferentialPayment(principal, rate, term, month)
      const principalPayment = principal / term
      const interestPayment = payment - principalPayment
      remainingBalance -= principalPayment

      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      })

      totalPayment += payment
      totalInterest += interestPayment
    }
  }

  return {
    monthlyPayment: schedule[0].payment,
    totalPayment,
    totalInterest,
    schedule,
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    let loanAmount = Number.parseFloat(data.loanAmount)
    const interestRate = Number.parseFloat(data.interestRate)
    const loanTerm = Number.parseInt(data.loanTerm)
    const paymentType = data.paymentType

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
      return NextResponse.json({ error: "Некорректные входные данные" }, { status: 400 })
    }

    if (data.downPayment) {
      const downPayment = Number.parseFloat(data.downPayment)
      if (!isNaN(downPayment)) {
        loanAmount -= downPayment
      }
    }

    const results = calculateSchedule(loanAmount, interestRate, loanTerm, paymentType)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Ошибка при расчете:", error)
    return NextResponse.json({ error: "Ошибка при расчете ипотеки" }, { status: 500 })
  }
}

