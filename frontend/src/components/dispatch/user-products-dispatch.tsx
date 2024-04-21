import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TProductSale } from "@/types/products"
import { TUser } from "@/types/user"
import { Separator } from "../ui/separator"
import { DispatchConfirmation } from "./dispatch-confirmation"
import { ProductsRepresentation } from "./products-representation"

type ProductId = number

export type UserProductsDispatchProps = {
  user: TUser
  products: [ProductId, TProductSale[]][]
}

export const UserProductsDispatch = ({ user, products }: UserProductsDispatchProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{user.name}</CardTitle>
        <CardDescription className="text-center">
          Matrícula: {user.matricula} | Username: {user.username} | ID: {user.id}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ProductsRepresentation products={products} />
      </CardContent>

      <CardFooter className="flex justify-end">
        <DispatchConfirmation user={user} products={products} />
      </CardFooter>
    </Card>
  )
}
