import { usePayments } from "@/hooks/payments"
import { TReachargesQuery } from "@/types/queries"

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
import { getAttachUrl } from "@/lib/utils"
import { FilePlus, FileText, Loader2, Plus } from "lucide-react"
import Link from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const RechargesTable = ({
  query: [query, setQuery],
}: {
  query: TReachargesQuery
}) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = usePayments(query)
  return (
    <div className="container mx-auto my-4">
      <Table className="border-2">
        <TableCaption>Histórico de Pagamentos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Usuário</TableHead>
            <TableHead className="text-center">Liberador / Rejeitador</TableHead>
            <TableHead className="text-center">Forma de Pagamento</TableHead>
            <TableHead className="text-center">Recebedor do Saldo Devedor</TableHead>
            <TableHead className="text-center">Valor (R$)</TableHead>
            <TableHead className="text-center">Observação</TableHead>
            <TableHead className="text-center">Data e Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.pages.map((page) =>
            page.payments.map((payment) => (
              <TableRow key={payment.id} className="text-center">
                <TableCell className="text-xs">{payment.id}</TableCell>
                <TableCell>
                  <Button variant="link" size="sm" className="h-2 p-0 my-0" asChild>
                    <Link
                      href={`/profile?userId=${payment.user.id}`}
                      className="text-xs"
                      target="_blank"
                    >
                      {payment.user.name}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {payment.allowed_by_user ? (
                    <Button variant="link" size="sm" className="h-2 py-0 my-0" asChild>
                      <Link
                        href={`/profile?userId=${payment.allowed_by_user.id}`}
                        className="text-xs"
                        target="_blank"
                      >
                        {payment.allowed_by_user.name}
                      </Link>
                    </Button>
                  ) : (
                    "Não Liberado ainda"
                  )}
                </TableCell>
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
                <TableCell>
                  {payment.payroll_receiver ? (
                    <Button variant="link" size="sm" className="h-2 py-0 my-0" asChild>
                      <Link
                        href={`/profile?userId=${payment.payroll_receiver.id}`}
                        className="text-xs"
                        target="_blank"
                      >
                        {payment.payroll_receiver.name}
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-red-500">Não é Folha de Pagamento</span>
                  )}
                </TableCell>
                <TableCell className="text-xs">{maskMoney(payment.value)}</TableCell>
                <TableCell className="w-12 text-xs text-wrap">
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
              {isFetchingNextPage ? <Loader2 className="animate-spin" /> : <Plus />}
              {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
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
