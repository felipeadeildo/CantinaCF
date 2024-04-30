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
import { maskMoney, sanitizeFMoney } from "@/lib/masks"
import { cn } from "@/lib/utils"
import { TProduct } from "@/types/products"
import { Loader, Pencil, Save, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { ProductStockModal } from "./product-stock-modal"

type Props = {
  product: TProduct
}

export const ProductCard = ({ product }: Props) => {
  const [isEditing, setIsEditing] = useState({ name: false, value: false })
  const [name, setName] = useState(product.name)
  const [value, setValue] = useState(product.value)

  const { updateProductMutation } = useProductsMutation()

  const toggleEditing = (field: "name" | "value") => {
    setIsEditing((prev) => {
      return { ...prev, [field]: !prev[field] }
    })
  }

  const submitChanges = (field: "name" | "value") => {
    updateProductMutation.mutate({ productId: product.id, name, value })
    toggleEditing(field)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center justify-between">
          {!isEditing.name && (
            <>
              <span>{product.name}</span>
              <Button size="sm" variant="secondary" onClick={() => toggleEditing("name")}>
                <Pencil size={16} />
              </Button>
            </>
          )}
          {isEditing.name && (
            <>
              <Input
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitChanges("name")
                }}
              />
              <Button
                size="sm"
                onClick={() => submitChanges("name")}
                disabled={!name || updateProductMutation.isPending}
              >
                {!updateProductMutation.isPending && <Save size={16} />}
                {updateProductMutation.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
              </Button>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex justify-end items-center gap-2 h-5">
        {!isEditing.value && (
          <Button
            asChild
            size="sm"
            variant="secondary"
            onClick={() => toggleEditing("value")}
          >
            <span className="font-semibold cursor-pointer">
              {maskMoney(product.value)}
            </span>
          </Button>
        )}
        {isEditing.value && (
          <Input
            className="text-center w-full max-w-34"
            defaultValue={maskMoney(value)}
            onChange={(e) => {
              e.target.value = maskMoney(e.target.value)
              setValue(parseFloat(sanitizeFMoney(e.target.value)))
            }}
            onBlur={() => submitChanges("value")}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitChanges("value")
            }}
            autoFocus
          />
        )}
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
