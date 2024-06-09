"use client"

import { UserProductsDispatch } from "@/components/dispatch/user-products-dispatch"
import { LoginRequired } from "@/components/login-required"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProductDispatch } from "@/hooks/products-dispatch"
import { Loader2 } from "lucide-react"

const Cantina = () => {
  const { data: productSales = [], isLoading } = useProductDispatch()

  return (
    <>
      <h1 className="text-2xl font-semibold text-center mb-4">Produtos para Despache</h1>
      {isLoading ? (
        <div className="mt-32 text-xl flex justify-center items-center">
          <Loader2 className="animate-spin" />
          Carregando...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {productSales.map(({ user, products }) => (
            <UserProductsDispatch key={user.id} user={user} products={products} />
          ))}
        </div>
      )}

      {productSales.length === 0 && (
        <div className="flex w-3/4 mx-auto">
          <Alert variant="destructive">
            <AlertDescription className="text-center">
              Sem produtos para despachar.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}

const ProtectedCantina = () => (
  <LoginRequired allowed_roles={[1, 2, 4]}>
    <Cantina />
  </LoginRequired>
)

export default ProtectedCantina
