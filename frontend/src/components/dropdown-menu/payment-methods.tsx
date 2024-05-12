import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePaymentMethods } from "@/hooks/payments"
import { TPaymentMethod } from "@/types/recharge"
import { Button } from "../ui/button"

type Props = {
  checkedPaymentMethodIds: number[]
  onCheckPaymentMethod: (paymentMethod: TPaymentMethod) => void
}

export const MultiSelectPaymentMethods = ({
  onCheckPaymentMethod,
  checkedPaymentMethodIds,
}: Props) => {
  const { data } = usePaymentMethods()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-xs w-full text-xs justify-start">
          Formas de Pagamento
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Selecione formas de pagamento</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data &&
          data.paymentMethods &&
          data.paymentMethods.map((paymentMethod) => (
            <DropdownMenuCheckboxItem
              key={paymentMethod.id}
              checked={checkedPaymentMethodIds.includes(paymentMethod.id)}
              onCheckedChange={() => onCheckPaymentMethod(paymentMethod)}
            >
              {paymentMethod.name} {paymentMethod.is_protected && "(protegido)"}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
