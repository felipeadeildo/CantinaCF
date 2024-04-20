"use client"

import { LoginRequired } from "@/components/login-required"
import { useProductDispatch } from "@/hooks/products_dispatch"

const Cantina = () => {
  const { productSales, isLoading } = useProductDispatch()

  return (
    <div>
      Produtos para Despache
      {isLoading && <div className="text-center mt-32 text-xl">Carregando...</div>}
      {productSales.map((sale) => (
        <div key={sale.id}>{sale.product.name}</div>
      ))}
    </div>
  )
}

const ProtectedCantina = () => (
  <LoginRequired allowed_roles={[1, 2, 4]}>
    <Cantina />
  </LoginRequired>
)

export default ProtectedCantina
