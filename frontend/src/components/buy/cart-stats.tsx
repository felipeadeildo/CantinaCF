import { Separator } from "@/components/ui/separator"
import { toReal } from "@/lib/utils"
import { CreditCard, ShoppingCart, X } from "lucide-react"

type Props = {
  quantityProductsInCart: number
  totalPrice: number
}

export const CartStats = ({ quantityProductsInCart, totalPrice }: Props) => {
  return (
    <div className="flex text-sm font-semibold gap-2 justify-center">
      <div className="flex gap-1 items-center">
        <ShoppingCart size={18} /> <X size={15} /> {quantityProductsInCart}
      </div>
      <Separator orientation="vertical" className="bg-primary" />
      <div className="flex gap-1 items-center">
        <CreditCard size={18} /> {toReal(totalPrice)}
      </div>
    </div>
  )
}
