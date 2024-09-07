import { TUser } from './user'

export type TPaymentMethod = {
  id: number
  name: string
  need_proof: boolean
  added_at: string
  updated_at: string
  is_payroll: boolean
  is_protected: boolean
}

export type TTRansactionData = {
  qr_code: string
  qr_code_base64: string
  ticket_url: string
  expiration_date: string
}

export type TPayment = {
  id: number
  payment_method_id: number
  observations: string
  value: number
  user_id: number
  allowed_by: number
  proof_path: string
  added_at: string
  payroll_receiver_id: number
  is_paypayroll: boolean
  status: string
  transaction_data_json: TTRansactionData
}

export const PaymentMethods = {
  PIX: '1',
  CREDIT_CARD: '2',
  DEBIT_CARD: '3',
  CASH: '4',
  PAYROLL: '5',
  SYSTEM: '6',
} as const

export type TPaymentRequest = Omit<
  TPayment,
  'allowed_by' | 'user_id' | 'payment_method_id' | 'payroll_receiver_id'
> & {
  user: TUser
  allowed_by_user: TUser | null
  payment_method: string
  payroll_receiver: TUser | null
}
