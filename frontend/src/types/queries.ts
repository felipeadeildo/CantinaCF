import { Dispatch } from "react"

export type TBRechargesQuery = {
  userId?: number
  allowedByUserId?: number
  payrollReceiverId?: number
  paymentMethodIds?: number[]
  roleIds?: number[]
  status?: string
  onlyIsPayroll?: boolean
  onlyIsPayPayroll?: boolean
  isPayrollHistory?: boolean
  from?: Date
  to?: Date,
}

export type TReachargesQuery = [
  TBRechargesQuery,
  Dispatch<React.SetStateAction<TBRechargesQuery>>
]
