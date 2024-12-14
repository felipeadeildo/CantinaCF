import { TProduct } from '@/types/products'
import { TCart } from '@/types/cart'
import { ProductCard } from './product-card'
import { Package2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

type ProductGridProps = {
  products: TProduct[]
  cart: TCart[]
  isLoading: boolean
}

export const ProductGrid = ({
  products,
  cart,
  isLoading,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Alert className="max-w-md w-full">
          <Package2 className="h-4 w-4" />
          <AlertTitle>Nenhum produto encontrado</AlertTitle>
          <AlertDescription>
            Tente ajustar sua busca ou verifique mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
        >
          <ProductCard
            product={product}
            cart={cart.find((c) => c.product.id === product.id) || null}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
