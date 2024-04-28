import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useProductsMutation } from "@/hooks/products"
import { maskMoney } from "@/lib/masks"
import { cn } from "@/lib/utils"
import { TProduct } from "@/types/products"
import { Edit, Loader, Pencil, Save, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { ProductStockModal } from "./product-stock-modal"

type Props = {
  product: TProduct
}

export const ProductCard = ({ product }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(product.name)

  const { renameProductMutation } = useProductsMutation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center justify-between">
          {!isEditing && (
            <>
              <span>{product.name}</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <Pencil size={16} />
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Input defaultValue={name} onChange={(e) => setName(e.target.value)} />
              <Button
                size="sm"
                onClick={() => {
                  renameProductMutation.mutate({ productId: product.id, name })
                  setIsEditing(false)
                }}
                disabled={!name || renameProductMutation.isPending}
              >
                {!renameProductMutation.isPending && <Save size={16} />}
                {renameProductMutation.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
              </Button>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex justify-end gap-2">
        <span className="font-semibold">{maskMoney(product.value)}</span>
        <Separator orientation="vertical" className="h-5 bg-primary" />
        <div
          className={cn(
            "flex items-center gap-1",
            product.quantity === 0 && "text-red-500"
          )}
        >
          <ShoppingCart size={18} />
          <X size={18} />
          {product.quantity}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end items-center">
        <ProductStockModal product={product} />
      </CardFooter>
    </Card>
  )
}
