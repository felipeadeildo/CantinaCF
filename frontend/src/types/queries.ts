import { Dispatch } from "react"
import { TPayment } from "./recharge"

export type TBRechargesQuery = {
  userId?: number
  receiverUserId?: number
  paymentMethodIds?: number[]
  roles?: number[]
  status?: Pick<TPayment, "status">
  onlyIsPayroll?: boolean
  onlyIsPayPayroll?: boolean
  from?: Date
  to?: Date
}

export type TReachargesQuery = [
  TBRechargesQuery,
  Dispatch<React.SetStateAction<TBRechargesQuery>>
]
