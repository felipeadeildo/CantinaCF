export type TPaymentMethod = {
  id: number
  name: string
  need_proof: boolean
  added_at: string
  updated_at: string
  is_payroll: boolean
  is_protected: boolean
}

export type Payment = {
  id: number
  payment_method_id: number
  observations: string
  value: number
  user_id: number
  allowed_by: number
  proof_path: string
  added_at: string
  is_payroll: boolean
  is_paypayroll: boolean
  status: string
}

export const PaymentMethods = {
  PIX: "1",
  CREDIT_CARD: "2",
  DEBIT_CARD: "3",
  CASH: "4",
  PAYROLL: "5",
  SYSTEM: "6",
} as const
