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
  size?: "default" | "sm"
}

export const ProductCard = ({ product, cart, size = "default" }: ProductCardProps) => {
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
      <CardHeader className={cn("my-0 py-2", size === "sm" && "py-1")}>
        <CardTitle
          className={cn(
            "text-base flex gap-2 items-center justify-center",
            cartQuantity > 0 && "text-emerald-300",
            size === "sm" && "text-sm"
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

      <CardFooter className={cn("justify-between", size === "sm" && "py-0")}>
        <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
          {product.quantity} restantes
        </Badge>

        <p className={cn("text-base font-semibold", size === "sm" && "text-sm")}>
          {toReal(product.value)}
        </p>

        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="accent"
            size="icon"
            disabled={cartQuantity === 0 || removeProductFromCartMutation.isPending}
            onClick={() => handleClick("remove")}
          >
            {removeProductFromCartMutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Minus />
            )}
          </Button>

          <span>{cartQuantity}</span>

          <Button
            variant="accent"
            size="icon"
            disabled={product.quantity === 0 || addProductToCartMutation.isPending}
            onClick={() => handleClick("add")}
          >
            {addProductToCartMutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Plus />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
