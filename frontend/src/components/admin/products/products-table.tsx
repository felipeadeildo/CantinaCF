import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TProduct } from '@/types/products'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { memo } from 'react'
import { ProductCard } from './product-card'

type ProductsGridProps = {
  products: TProduct[]
  onUpdate: (id: number, data: Partial<TProduct>) => void
  onDelete: (id: number) => void
}

export const ProductsGrid = memo(
  ({ products, onUpdate, onDelete }: ProductsGridProps) => {
    if (products.length === 0) {
      return (
        <div className="w-full flex items-center justify-center p-4">
          <Alert
            variant="default"
            className="max-w-md w-full flex gap-4 items-center"
          >
            <Package className="h-4 w-4 opacity-75" />
            <div className="flex-1">
              <AlertTitle className="text-base">
                Nenhum produto encontrado
              </AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                Tente ajustar sua pesquisa ou adicione novos produtos.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )
    }

    return (
      <div className="w-full">
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
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
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contador de produtos */}
        <div className="w-full mt-6 px-4">
          <p className="text-center text-sm text-muted-foreground">
            {products.length}{' '}
            {products.length === 1
              ? 'produto encontrado'
              : 'produtos encontrados'}
          </p>
        </div>
      </div>
    )
  }
)

ProductsGrid.displayName = 'ProductsGrid'
