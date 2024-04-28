import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateProductForm } from "./create-product-form"

export const CreateProductModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="fixed right-5 bottom-5">
          <Plus className="mr-1" />
          Criar Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
        </DialogHeader>

        <CreateProductForm />
      </DialogContent>
    </Dialog>
  )
}
