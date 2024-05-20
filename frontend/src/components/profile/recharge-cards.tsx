import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePayments } from "@/hooks/payments"
import { maskMoney } from "@/lib/masks"
import { cn, getAttachUrl } from "@/lib/utils"
import { TRechargesQuery } from "@/types/queries"
import { ArrowDownCircle, FilePlus, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

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
            <Card
              key={payment.id}
              className={cn(
                "border-2",
                payment.status == "accepted" && "bg-primary/10",
                payment.status == "rejected" && "bg-destructive/10",
                payment.status == "to allow" && "bg-yellow-400/30"
              )}
            >
              <CardContent className="grid gap-0.5">
                <div>
                  <strong>
                    {payment.status === "accepted" ? "Aceito por:" : "Rejeitado por:"}
                  </strong>
                  {payment.allowed_by_user ? (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-2 py-0 px-1 my-0"
                      asChild
                    >
                      <Link
                        href={`/profile?userId=${payment.allowed_by_user.id}`}
                        target="_blank"
                      >
                        {payment.allowed_by_user.name}
                      </Link>
                    </Button>
                  ) : (
                    "Não Liberado ainda"
                  )}
                </div>

                <div>
                  <strong>Forma de Pagamento:</strong>
                  {payment.proof_path ? (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-2 py-0 px-1 my-0"
                      asChild
                    >
                      <Link href={getAttachUrl(payment.proof_path)} target="_blank">
                        <FileText size={16} className="mr-1" />
                        {payment.payment_method}
                      </Link>
                    </Button>
                  ) : (
                    <span className="ml-1">{payment.payment_method}</span>
                  )}
                </div>

                {payment.payroll_receiver && (
                  <div>
                    <strong>Recebedor do Saldo Devedor:</strong>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-2 py-0 px-0.5 my-0"
                      asChild
                    >
                      <Link
                        href={`/profile?userId=${payment.payroll_receiver.id}`}
                        target="_blank"
                      >
                        {payment.payroll_receiver.name}
                      </Link>
                    </Button>
                  </div>
                )}
                <div>
                  <strong>Valor:</strong> <span>{maskMoney(payment.value)}</span>
                </div>
                {payment.observations && (
                  <div>
                    <strong>Observação:</strong> {payment.observations}
                  </div>
                )}
                <div>
                  <strong>Data e Hora:</strong> {payment.added_at}
                </div>
              </CardContent>
            </Card>
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
