import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useProductsMutation } from "@/hooks/products"
import { cn, toReal } from "@/lib/utils"
import { TCart } from "@/types/cart"
import { TProduct } from "@/types/products"
import { LoaderCircle, Minus, Plus, ShoppingCart } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"

type ProductCardProps = {
  product: TProduct
  cart: TCart | null
}

export const ProductCard = ({ product, cart }: ProductCardProps) => {
  const { addProductToCartMutation, removeProductFromCartMutation } =
    useProductsMutation()
  const { toast } = useToast()

  const handleClick = async (action: "add" | "remove") => {
    const callback =
      action === "add" ? addProductToCartMutation : removeProductFromCartMutation

    const { message } = await callback.mutateAsync(product.id)

    toast({
      // title: "Mensagem",
      description: message,
      variant: "info",
    })
  }

  const cartQuantity = cart ? cart.quantity : 0

  return (
    <Card>
      <CardHeader className="my-0 py-2">
        <CardTitle
          className={cn(
            "text-base flex gap-2 items-center justify-center",
            cartQuantity > 0 && "text-emerald-300"
          )}
        >
          {product.name}
          {cartQuantity > 0 && (
            <Badge>
              <ShoppingCart size={15} className="mr-1.5" /> {cartQuantity}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="justify-between">
        <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
          {product.quantity} restantes
        </Badge>

        <p className="text-base font-semibold">
          {toReal(product.value)}</p>

        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="accent"
            size="icon"
            disabled={cartQuantity === 0 || removeProductFromCartMutation.isPending}
            onClick={() => handleClick("remove")}
          >
            {removeProductFromCartMutation.isPending ? <LoaderCircle /> : <Minus />}
          </Button>

          <span>{cartQuantity}</span>

          <Button
            variant="accent"
            size="icon"
            disabled={product.quantity === 0 || addProductToCartMutation.isPending}
            onClick={() => handleClick("add")}
          >
            {addProductToCartMutation.isPending ? <LoaderCircle /> : <Plus />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
