import { TCart } from '@/types/cart'
import { AnimatePresence, motion } from 'framer-motion'
import { CartStats } from './cart-stats'
import { PurchaseConfirmation } from './purchase-confirmation'

type BuyFooterProps = {
  cart: TCart[]
}

export const BuyFooter = ({ cart }: BuyFooterProps) => {
  const quantityProductsInCart = cart.reduce((a, b) => a + b.quantity, 0)
  const totalPrice = cart.reduce((a, b) => a + b.quantity * b.product.value, 0)

  const hasItems = quantityProductsInCart > 0

  return (
    <AnimatePresence>
      {hasItems && (
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-t shadow-lg"
        >
          <div className="container mx-auto">
            {/* Layout para telas menores (empilhado e centralizado) */}
            <div className="block sm:hidden px-3 py-3">
              <div className="flex flex-col justify-center items-center mb-2">
                <CartStats
                  quantityProductsInCart={quantityProductsInCart}
                  totalPrice={totalPrice}
                  variant="compact"
                />
              </div>
              <div className="flex justify-center items-center">
                <PurchaseConfirmation
                  cart={cart}
                  quantityProductsInCart={quantityProductsInCart}
                  totalPrice={totalPrice}
                  className="w-full max-w-xs"
                />
              </div>
            </div>

            {/* Layout para telas maiores (lado a lado) */}
            <div className="hidden sm:flex items-center justify-between gap-4 px-6 py-4">
              <CartStats
                quantityProductsInCart={quantityProductsInCart}
                totalPrice={totalPrice}
              />
              <PurchaseConfirmation
                cart={cart}
                quantityProductsInCart={quantityProductsInCart}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  )
}
