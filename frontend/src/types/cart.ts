import { TProduct } from "./products"

export type TCart = {
  id: number
  user_id: number
  product: TProduct
  quantity: number
  added_at: string
}
