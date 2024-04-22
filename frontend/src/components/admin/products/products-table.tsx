import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { TProduct } from "@/types/products"
import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  products: TProduct[]
}

export const ProductsTable = ({ products }: Props) => {
  const [productsIsEditing, setProductsIsEditing] = useState<boolean[]>([])
  useEffect(() => {
    setProductsIsEditing(Array(products.length).fill(false))
  }, [products])

  const toggleIsEditing = (index: number) => {
    setProductsIsEditing((prevState) =>
      prevState.map((product, i) => (i === index ? !product : product))
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {products.map((product, index) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle className="flex flex-col">
              <div className="flex gap-2 items-center">
                <span>{product.name}</span>
                <Button
                  size="icon"
                  onClick={() => toggleIsEditing(index)}
                  disabled={productsIsEditing[index]}
                >
                  <Pencil size={18} />
                </Button>
              </div>
              {productsIsEditing[index] && (
                <Input defaultValue={product.name} onChange={(e) => {}} />
              )}
            </CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>{product.quantity}</CardContent>
          <CardFooter className="flex justify-end"></CardFooter>
        </Card>
      ))}
    </div>
  )
}
