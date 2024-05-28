import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TSalesQuery } from "@/types/queries"
import { BarChart3, Loader } from "lucide-react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProductSalesStats } from "@/hooks/stats"
import { maskMoney } from "@/lib/masks"

export const ProductSalesStats = ({
  query: [query, setQuery],
}: {
  query: TSalesQuery
}) => {
  const { data, isLoading } = useProductSalesStats(query)

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="fixed bottom-4 left-4">
          <BarChart3 />
          Ver Estatísticas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estatísticas de Venda de Produtos</DialogTitle>
          <DialogDescription>
            Quantidade de produtos vendidos e valor total de vendas.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto h-96">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-xs">Produto</TableHead>
                <TableHead className="text-center text-xs">Valor Unitário</TableHead>
                <TableHead className="text-center text-xs">Quantidade Vendida</TableHead>
                <TableHead className="text-right text-xs">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell className="font-medium text-left text-xs">{item.product.name}</TableCell>
                    <TableCell className="text-center text-xs">{maskMoney(item.product.value)}</TableCell>
                    <TableCell className="text-center text-xs">{item.sales}</TableCell>
                    <TableCell className="text-right text-xs">{maskMoney(item.spent)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>

            <TableCaption>
              {isLoading && (
                <div className="flex justify-center items-center gap-2">
                  <Loader className="animate-spin" /> Carregando...
                </div>
              )}
              {!isLoading && (
                <>
                  Total de vendas:{" "}
                  {maskMoney(data?.reduce((a, b) => a + b.spent, 0) || 0)}
                </>
              )}
            </TableCaption>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
