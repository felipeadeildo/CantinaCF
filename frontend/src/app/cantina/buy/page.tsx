"use client"

import { BuyFooter } from "@/components/buy/buy-footer"
import { ProductCard } from "@/components/buy/product-card"
import { LoginRequired } from "@/components/login-required"
import { Input } from "@/components/ui/input"
import { useCart, useProducts } from "@/hooks/products"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

const Buy = () => {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(timer)
  }, [query])

  const { data: data = { products: [] }, isLoading } = useProducts(debouncedQuery)
  const { data: cart = [] } = useCart()

  return (
    <>
      <div className="container mx-auto">
        <Input
          startIcon={Search}
          className="my-4"
          placeholder="Pesquisar produtos..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {isLoading && <div className="text-center mt-32 text-xl">Carregando...</div>}
          {data.products?.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              cart={cart.find((c) => c.product.id === product.id) || null}
            />
          ))}
        </div>
      </div>
      <BuyFooter cart={cart} />
    </>
  )
}

const ProtectedBuy = () => {
  return (
    <LoginRequired>
      <Buy />
    </LoginRequired>
  )
}

export default ProtectedBuy
