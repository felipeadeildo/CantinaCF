import { Button } from "@/components/ui/button"
import { TCart } from "@/types/cart"
import { ShoppingBag } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { BuyForm } from "./buy-form"
import { CartStats } from "./cart-stats"
import { ProductCard } from "./product-card"

type Props = {
  cart: TCart[]
  quantityProductsInCart: number
  totalPrice: number
}

export const PurcharseConfirmation = ({
  cart,
  quantityProductsInCart,
  totalPrice,
}: Props) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasCart = cart.some((c) => c.quantity > 0)
    if (!hasCart) return setOpen(false)

    // se o usuário ficar sem alterar o carrinho por alguns segundos, ele pode confirmar
    const timer = setTimeout(() => setOpen(cart.some((c) => c.quantity > 0)), 60000)

    return () => clearTimeout(timer)
  }, [cart])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="ml-4 font-bold"
          variant={quantityProductsInCart === 0 ? "ghost" : "default"}
          disabled={quantityProductsInCart === 0}
        >
          <ShoppingBag className="mr-2" /> Confirmar Compra
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
          <DialogDescription>
            Confira os Produtos, preencha suas credenciais e confirme a compra.
          </DialogDescription>

          <CartStats
            quantityProductsInCart={quantityProductsInCart}
            totalPrice={totalPrice}
          />

          <div className="overflow-y-auto max-h-[300px] flex flex-col gap-1">
            {cart.map((item) => {
              return (
                item.quantity > 0 && (
                  <ProductCard
                    product={item.product}
                    cart={item}
                    key={item.product.id}
                    size="sm"
                  />
                )
              )
            })}
          </div>

          <BuyForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
