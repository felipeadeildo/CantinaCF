import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useProductSalesDispatchMutation } from "@/hooks/products-dispatch"
import { Truck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"
import { ProductsRepresentation } from "./products-representation"
import { UserProductsDispatchProps } from "./user-products-dispatch"

export const DispatchConfirmation = ({ user, products }: UserProductsDispatchProps) => {
  const { productSalesDispatch } = useProductSalesDispatchMutation()
  const { isPending, isError, error } = productSalesDispatch
  const { toast } = useToast()

  const handleConfirmation = async () => {
    const result = await productSalesDispatch.mutateAsync(user.id)
    toast({
      title: "Mensagem",
      description: result.message,
      variant: "default",
    })
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="default">
          <Truck className="mr-1" />
          Despachar Produtos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que desejas despachar esses produtos?</DialogTitle>
          <DialogDescription>
            Esta ação irá despachar esses produtos para o usuário{" "}
            <span className="font-bold">{user.name}</span> e não poderá ser revertida.
            Prossiga somente quando os produtos tiverem sidos entregues ao usuário.
          </DialogDescription>
        </DialogHeader>

        {isError && (
          <Alert className="text-red-500 my-3">
            <AlertTitle>Ocorreu um erro</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <ProductsRepresentation products={products} />

        <DialogFooter>
          <Button variant="destructive" onClick={handleConfirmation} disabled={isPending}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
