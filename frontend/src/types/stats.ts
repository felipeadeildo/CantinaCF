export type PaymentMethodStats = {
  paymentMethod: string
  value: number
}[]

export type ProductSaleStats = {
  product: string
  value: number
  spent: number
}[]

export type ProductSoldTotal = {
  totalSpent: number
  totalSales: number
}

export type TStats = {
  paymentMethodQuantity: PaymentMethodStats
  paymentMethodMoney: PaymentMethodStats
  productQuantity: ProductSaleStats
  productSoldTotal: ProductSoldTotal
}
