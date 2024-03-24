import { TCart } from "@/types/cart"
import { CartStats } from "./cart-stats"
import { PurcharseConfirmation } from "./purcharse-confirmation"

type Props = {
  cart: TCart[]
}

export const BuyFooter = ({ cart }: Props) => {
  const quantityProductsInCart = cart.reduce((a, b) => a + b.quantity, 0)
  const totalPrice = cart.reduce((a, b) => a + b.quantity * b.product.value, 0)
  return (
    <footer className="p-4 fixed bottom-0 w-full bg-background/90 flex justify-between border-t-2 border-blue-600 rounded-lg">
      <CartStats
        quantityProductsInCart={quantityProductsInCart}
        totalPrice={totalPrice}
      />

      <PurcharseConfirmation
        cart={cart}
        quantityProductsInCart={quantityProductsInCart}
        totalPrice={totalPrice}
      />
    </footer>
  )
}
