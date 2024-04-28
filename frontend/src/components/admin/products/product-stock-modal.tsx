import { Button } from "@/components/ui/button"
import { Edit, Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { TProduct } from "@/types/products"
import { ProductStockForm } from "./product-stock-form"

type Props = {
  product?: TProduct
}

export const ProductStockModal = ({ product }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={product ? "outline" : "default"}
          className={cn(!product && "fixed bottom-4 right-4")}
          size="sm"
        >
          {!product && <Plus className="mr-1" />}
          {product ? "Adicionar Estoque" : "Criar Novo Produto"}
          {product && <Edit className="ml-1" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product
              ? `Adicionar estoque do produto ${product.name}`
              : "Criar Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <ProductStockForm product={product} />
      </DialogContent>
    </Dialog>
  )
}
