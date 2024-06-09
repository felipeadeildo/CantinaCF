import { Button } from "@/components/ui/button"
import { Edit, Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductStockForm } from "./product-stock-form"

export const ProductStockModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="fixed bottom-4 right-4" size="sm">
          <Plus className="mr-1" />
          Criar Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
        </DialogHeader>

        <ProductStockForm />
      </DialogContent>
    </Dialog>
  )
}
