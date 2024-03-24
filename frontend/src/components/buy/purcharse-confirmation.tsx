import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toReal } from "@/lib/utils"
import { TCart } from "@/types/cart"
import { ShoppingBag } from "lucide-react"
import { Button } from "../ui/button"

type Props = {
  cart: TCart[]
}

export const PurchaseConfirmation = ({ cart }: Props) => {
  const quantityProductsInCart = cart.reduce((a, b) => a + b.quantity, 0)
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={quantityProductsInCart > 0 ? "default" : "destructive"}
          size="icon"
          className="fixed right-4 bottom-10"
          disabled={quantityProductsInCart === 0}
        >
          <ShoppingBag />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmação de Compra</DialogTitle>
          <DialogDescription>
            Confira os produtos que estão no carrinho, preencha seu login e senha e efetue
            a compra S2!
          </DialogDescription>
        </DialogHeader>

        <h1 className="text-xl">
          Carrinho - {quantityProductsInCart} produtos - Total:{" "}
          {toReal(cart.reduce((a, b) => a + b.product.value * b.quantity, 0))}
        </h1>

        {cart.map((item) => {
          return (
            item.quantity > 0 && (
              <div key={item.id}>
                <p>
                  <strong>Nome:</strong> {item.product.name}
                </p>
                <p>
                  <strong>Valor:</strong> {toReal(item.product.value)}
                </p>
                <p>
                  <strong>Quantidade:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Total:</strong> {toReal(item.product.value * item.quantity)}
                </p>
              </div>
            )
          )
        })}

        <Button>Comprar!</Button>
      </DialogContent>
    </Dialog>
  )
}
