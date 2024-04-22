"use client"

import { ProductsTable } from "@/components/admin/products/products-table"
import { LoginRequired } from "@/components/login-required"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/hooks/products"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

const Products = () => {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(timer)
  }, [query])

  const { isLoading, data } = useProducts(debouncedQuery)
  const { products, message } = data || {}
  return (
    <>
      <h1 className="text-xl font-semibold text-center">Produtos da Cantina</h1>

      <Input
        className="my-4"
        placeholder="Pesquisar produtos..."
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />

      {isLoading ? (
        <div className="mt-32 text-xl flex justify-center items-center">
          <Loader2 className="animate-spin" />
          Carregando...
        </div>
      ) : (
        <ProductsTable products={products || []} />
      )}

      {message && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </>
  )
}

const ProductsProtected = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <Products />
    </LoginRequired>
  )
}

export default ProductsProtected
