import { usePayments } from "@/hooks/payments"
import { TRechargesQuery } from "@/types/queries"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { maskMoney } from "@/lib/masks"
import { cn, getAttachUrl } from "@/lib/utils"
import { ArrowDownCircle, FilePlus, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const RechargesTable = ({
  query: [query, setQuery],
  isPayrollHistory = false,
}: {
  query: TRechargesQuery
  isPayrollHistory?: boolean
}) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    usePayments(query)
  return (
    <div className={cn("my-4", !isPayrollHistory && "container mx-auto")}>
      <Table className="border-2">
        <TableCaption>Histórico de Pagamentos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Usuário</TableHead>
            <TableHead className="text-center">Liberador / Rejeitador</TableHead>
            {!isPayrollHistory && (
              <TableHead className="text-center">Forma de Pagamento</TableHead>
            )}
            {!isPayrollHistory && (
              <TableHead className="text-center">Recebedor do Saldo Devedor</TableHead>
            )}
            <TableHead className="text-center">Valor (R$)</TableHead>
            <TableHead className="text-center">Observação</TableHead>
            <TableHead className="text-center">Data e Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell className="flex gap-2 items-center justify-center">
                <Loader2 className="animate-spin" />
                Carregando...
              </TableCell>
            </TableRow>
          )}
          {data?.pages.map((page) =>
            page.payments.map((payment) => (
              <TableRow key={payment.id} className="text-center">
                <TableCell className="text-xs">{payment.id}</TableCell>
                <TableCell className="p-0">
                  <Button variant="link" size="sm" className="h-2 p-0 my-0" asChild>
                    <Link
                      href={`/profile?userId=${payment.user.id}`}
                      className="text-xs text-wrap"
                      target="_blank"
                    >
                      {payment.user.name}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell className="p-0">
                  {payment.allowed_by_user ? (
                    <Button variant="link" size="sm" className="h-2 py-0 my-0" asChild>
                      <Link
                        href={`/profile?userId=${payment.allowed_by_user.id}`}
                        className="text-xs text-wrap"
                        target="_blank"
                      >
                        {payment.allowed_by_user.name}
                      </Link>
                    </Button>
                  ) : (
                    "Não Liberado ainda"
                  )}
                </TableCell>
                {!isPayrollHistory && (
                  <TableCell className="text-xs">
                    {payment.proof_path ? (
                      <Button variant="link" size="sm" className="h-2 py-0 my-0" asChild>
                        <Link
                          href={getAttachUrl(payment.proof_path)}
                          className="text-xs"
                          target="_blank"
                        >
                          <FileText size={16} className="mr-1" />
                          {payment.payment_method}
                        </Link>
                      </Button>
                    ) : (
                      payment.payment_method
                    )}
                  </TableCell>
                )}

                {!isPayrollHistory && (
                  <TableCell>
                    {payment.payroll_receiver ? (
                      <Button variant="link" size="sm" className="h-2 py-0 my-0" asChild>
                        <Link
                          href={`/profile?userId=${payment.payroll_receiver.id}`}
                          className="text-xs text-wrap"
                          target="_blank"
                        >
                          {payment.payroll_receiver.name}
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-red-500">
                        Não é Folha de Pagamento
                      </span>
                    )}
                  </TableCell>
                )}
                <TableCell
                  className={cn(
                    "text-xs",
                    isPayrollHistory &&
                      payment.payment_method.includes("Folha") &&
                      "text-red-500 font-semibold",
                    isPayrollHistory &&
                      payment.is_paypayroll &&
                      "text-green-500 font-semibold"
                  )}
                >
                  {maskMoney(payment.value)}
                </TableCell>
                <TableCell className="w-12 text-xs text-wrap ">
                  {payment.observations || "-"}
                </TableCell>

                <TableCell className="text-xs text-wrap">{payment.added_at}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {data?.pages && data?.pages[0].payments.length === 0 && (
          <TableCell colSpan={7} className="text-center">
            Nenhum Resultado Encontrado
          </TableCell>
        )}

        {hasNextPage && (
          <TableCell colSpan={7} className="text-center">
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
          </TableCell>
        )}
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" className="fixed bottom-4 right-4">
              <FilePlus className="mr-1 h-5 w-5" />
              Exportar
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exportar histórico de pagamentos para o Excel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
