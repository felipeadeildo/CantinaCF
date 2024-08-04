import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useProductsMutation } from "@/hooks/products"
import { maskMoney, sanitizeFMoney } from "@/lib/masks"
import { TProduct } from "@/types/products"
import { Loader, Pencil, Save, ShoppingCart, Trash, X } from "lucide-react"
import { useState } from "react"

type Props = {
  product: TProduct
}

export const ProductCard = ({ product }: Props) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    value: false,
    quantity: false,
  })
  const [name, setName] = useState(product.name)
  const [value, setValue] = useState(product.value)
  const [quantity, setQuantity] = useState(product.quantity)

  const { updateProductMutation, deleteProductMutation } = useProductsMutation()

  const toggleEditing = (field: "name" | "value" | "quantity") => {
    setIsEditing((prev) => {
      return { ...prev, [field]: !prev[field] }
    })
  }

  const submitChanges = (field: "name" | "value" | "quantity") => {
    updateProductMutation.mutate({ productId: product.id, name, value, quantity })
    toggleEditing(field)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center justify-between">
          {!isEditing.name && (
            <>
              <span>{product.name}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleEditing("name")}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteProductMutation.mutate(product.id)}
                  disabled={updateProductMutation.isPending}
                >
                  <Trash size={16} />
                </Button>
              </div>
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
        {!isEditing.quantity && (
          <Button
            asChild
            size="sm"
            variant={product.quantity === 0 ? "destructive" : "secondary"}
            onClick={() => toggleEditing("quantity")}
          >
            <span className="flex items-center gap-1">
              <ShoppingCart size={18} />
              <X size={18} />
              {product.quantity}
            </span>
          </Button>
        )}
        {isEditing.quantity && (
          <>
            <Input
              defaultValue={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value.trim()))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitChanges("quantity")
              }}
            />
            <Button
              size="sm"
              onClick={() => submitChanges("quantity")}
              disabled={!name || updateProductMutation.isPending}
            >
              {!updateProductMutation.isPending && <Save size={16} />}
              {updateProductMutation.isPending && (
                <Loader size={16} className="animate-spin" />
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
