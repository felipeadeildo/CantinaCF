import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { useProductSales } from "@/hooks/product-sales"
import { maskMoney } from "@/lib/masks"
import { TSalesQuery } from "@/types/queries"
import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip"
import { ArrowDownCircle, FilePlus, Loader2 } from "lucide-react"
import Link from "next/link"

export const ProductSalesTable = ({
  query: [query, setQuery],
}: {
  query: TSalesQuery
}) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useProductSales(query)
  return (
    <div className="my-4">
      <Table className="border-2">
        <TableCaption>Histórico de Pagamentos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Produto</TableHead>
            <TableHead className="text-center">Comprador</TableHead>
            <TableHead className="text-center">Valor (R$)</TableHead>
            <TableHead className="text-center">Data de Compra</TableHead>
            <TableHead className="text-center">Data de Despacho</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.pages.map((page) =>
            page.sales.map((sale) => (
              <TableRow key={sale.id} className="text-center">
                <TableCell className="text-xs">{sale.id}</TableCell>
                <TableCell className="p-0">{sale.product.name}</TableCell>
                <TableCell className="p-0">
                  {sale.sold_to ? (
                    <Button variant="link" size="sm" className="h-2 py-0 my-0" asChild>
                      <Link
                        href={`/profile?userId=${sale.sold_to.id}`}
                        className="text-xs text-wrap"
                        target="_blank"
                      >
                        {sale.sold_to.name}
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-red-500">N/D</span>
                  )}
                </TableCell>

                <TableCell className="text-xs">{maskMoney(sale.value)}</TableCell>

                <TableCell className="text-xs text-wrap">{sale.added_at}</TableCell>
                <TableCell className="text-xs text-wrap">{sale.dispatched_at}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {data?.pages && data?.pages[0].sales.length === 0 && (
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
            <p>Exportar histórico de vendas para o Excel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
