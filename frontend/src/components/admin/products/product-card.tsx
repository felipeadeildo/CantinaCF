import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useProductsMutation } from "@/hooks/products"
import { TProduct } from "@/types/products"
import { Edit, Loader, Pencil, Save, ShoppingCart, X } from "lucide-react"
import { useState } from "react"

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
              <Button size="sm" variant="secondary" onClick={() => setIsEditing((prev) => !prev)}>
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

      <CardContent className="flex justify-end">
        <div className="flex items-center gap-1">
          <ShoppingCart size={18} />
          <X size={18} />
          {product.quantity}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-1">
          Adicionar Estoque
          <Edit size={18} />
        </Button>
      </CardFooter>
    </Card>
  )
}
