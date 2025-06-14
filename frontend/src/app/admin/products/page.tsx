'use client'

import { ProductsGrid } from '@/components/admin/products/products-table'
import { CreateProductDialog } from '@/components/admin/products/create-product-dialog'
import { LoginRequired } from '@/components/login-required'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { useProducts, useProductsMutation } from '@/hooks/products'
import { TProduct } from '@/types/products'
import { useDebounce } from '@uidotdev/usehooks'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { isLoading, data, refetch } = useProducts(debouncedSearchTerm)
  const { updateProductMutation, deleteProductMutation } = useProductsMutation()

  const handleUpdate = async (id: number, partialData: Partial<TProduct>) => {
    if (!data?.products) return
    const product = data.products.find((p) => p.id === id)
    if (!product) return

    const updateData = {
      productId: id,
      name: partialData.name ?? product.name,
      value: partialData.value ?? product.value,
      quantity: partialData.quantity ?? product.quantity,
    }

    await updateProductMutation.mutateAsync(updateData)
    refetch()
  }

  const handleDelete = async (id: number) => {
    await deleteProductMutation.mutateAsync(id)
    refetch()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">
          Produtos da Cantina
        </h1>
        <CreateProductDialog />
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <Input
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin mr-2" />
          <span>Carregando...</span>
        </div>
      ) : (
        <ProductsGrid
          products={data?.products || []}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {data?.message && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

const ProductsProtected = () => (
  <LoginRequired allowed_roles={[1]}>
    <Products />
  </LoginRequired>
)

export default ProductsProtected
