import { Alert, AlertTitle } from "@/components/ui/alert"

import { TProduct } from "@/types/products"
import { ProductCard } from "./product-card"

type Props = {
  products: TProduct[]
}

export const ProductsTable = ({ products }: Props) => {
  if (products.length === 0)
    return (
      <Alert className="w-3/12 mx-auto">
        <AlertTitle className="text-center">Nenhum produto encontrado</AlertTitle>
      </Alert>
    )
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  )
}
