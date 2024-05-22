import { Button } from "@/components/ui/button"
import { usePayments } from "@/hooks/payments"
import { TRechargesQuery } from "@/types/queries"
import { ArrowDownCircle, Loader2 } from "lucide-react"
import { PaymentCard } from "./payment-card"

export const RechargesCards = ({
  query: [query, setQuery],
}: {
  query: TRechargesQuery
}) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    usePayments(query)

  return (
    <div className="mt-4 h-[calc(100vh-20rem)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
            Carregando...
          </div>
        )}
        {data?.pages.map((page) =>
          page.payments.map((payment) => (
            <PaymentCard payment={payment} key={payment.id} />
          ))
        )}
        {data?.pages && data?.pages[0].payments.length === 0 && (
          <div className="text-center">Nenhum Resultado Encontrado</div>
        )}
        {hasNextPage && (
          <div className="text-center">
            <Button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
              <div className="flex gap-2 items-center justify-center">
                {isFetchingNextPage ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowDownCircle />
                )}
                {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
