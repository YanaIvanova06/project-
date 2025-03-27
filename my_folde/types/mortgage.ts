export interface Bank {
  id: string
  name: string
  logo: string
  programs: MortgageProgram[]
}

export interface MortgageProgram {
  id: string
  name: string
  description: string
  minRate: number
  maxRate: number
  maxAmount: number
  minInitialPayment: number
  term: {
    min: number
    max: number
  }
  requirements: string[]
  benefits: string[]
  type: "standard" | "family" | "it" | "government"
}

export interface MortgageSchedule {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageResults {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: MortgageSchedule[]
}

