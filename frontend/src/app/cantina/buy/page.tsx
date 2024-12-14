'use client'

import { BuyFooter } from '@/components/buy/buy-footer'
import { ProductGrid } from '@/components/buy/product-grid'
import { LoginRequired } from '@/components/login-required'
import { Input } from '@/components/ui/input'
import { useCart, useProducts } from '@/hooks/products'
import { useDebounce } from '@uidotdev/usehooks'
import { Search } from 'lucide-react'
import { useState } from 'react'

const Buy = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: data = { products: [] }, isLoading } =
    useProducts(debouncedSearch)
  const { data: cart = [] } = useCart()

  return (
    <div className="min-h-screen pb-24">
      {/* Header com Pesquisa */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <div className="flex h-16 items-center px-4 sm:px-8">
            <div className="relative flex-1 max-w-2xl mx-auto">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/70">
                <Search className="h-4 w-4" strokeWidth={2} />
              </div>
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-10 w-full bg-muted/40 border-muted-foreground/20 focus-visible:bg-background"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 sm:px-8 py-8">
        <ProductGrid
          products={data?.products || []}
          cart={cart}
          isLoading={isLoading}
        />
      </main>

      {/* Footer Fixo */}
      <BuyFooter cart={cart} />
    </div>
  )
}

const ProtectedBuy = () => (
  <LoginRequired>
    <Buy />
  </LoginRequired>
)

export default ProtectedBuy
