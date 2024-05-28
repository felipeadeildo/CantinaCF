import { TUser } from "./user"

export type TProduct = {
  id: number
  name: string
  description: string
  value: number
  type: string
  quantity: number
  added_at: string
  updated_at: string
}

export type TProductSale = {
  id: number
  added_at: string
  dispatched_at: string
  dispatched_by: TUser | null
  product: TProduct
  sold_by: TUser | null
  sold_to: TUser | null
  status: "to dispatch" | "dispatched"
  value: number
}
