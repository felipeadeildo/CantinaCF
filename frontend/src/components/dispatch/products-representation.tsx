import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { UserProductsDispatchProps } from "./user-products-dispatch"

export const ProductsRepresentation = ({
  products,
}: Omit<UserProductsDispatchProps, "user">) => {
  return (
    <ScrollArea className="h-64 w-full rounded-md border p-4">
      {products.map(([productId, sales]) => (
        <div key={productId} className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-emerald-300">{sales[0].product.name}</p>
            <p className="text-center">{sales.length}</p>
          </div>
          <Separator />
        </div>
      ))}
    </ScrollArea>
  )
}
