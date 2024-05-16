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
  to?: Date
}

export type TRechargesQuery = [
  TBRechargesQuery,
  Dispatch<React.SetStateAction<TBRechargesQuery>>
]

export type TBSalesQuery = {
  soldToUserId?: number
  productId?: number
  from?: Date
  to?: Date
}

export type TSalesQuery = [TBSalesQuery, Dispatch<React.SetStateAction<TBSalesQuery>>]

export type TBStatsQuery = {
  userId?: number
  to?: Date
  from?: Date
}

export type TStatsQuery = [TBStatsQuery, Dispatch<React.SetStateAction<TBStatsQuery>>]
