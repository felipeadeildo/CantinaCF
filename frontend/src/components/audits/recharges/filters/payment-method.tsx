import { MultiSelectPaymentMethods } from "@/components/dropdown-menu/payment-methods"
import { TRechargesQuery } from "@/types/queries"
import { TPaymentMethod } from "@/types/recharge"
import { useCallback } from "react"

export const PaymentMethodsFilter = ({
  query: [query, setQuery],
}: {
  query: TRechargesQuery
}) => {
  const togglePaymentMethod = useCallback(
    (paymentMethod: TPaymentMethod) => {
      setQuery({
        ...query,
        paymentMethodIds: query.paymentMethodIds?.includes(paymentMethod.id)
          ? query.paymentMethodIds?.filter((id) => id !== paymentMethod.id)
          : query.paymentMethodIds
          ? [...query.paymentMethodIds, paymentMethod.id]
          : [paymentMethod.id],
      })
    },
    [query, setQuery]
  )

  return (
    <MultiSelectPaymentMethods
      onCheckPaymentMethod={togglePaymentMethod}
      checkedPaymentMethodIds={query.paymentMethodIds || []}
    />
  )
}
