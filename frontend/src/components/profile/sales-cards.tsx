import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProductSales } from "@/hooks/product-sales"
import { maskMoney } from "@/lib/masks"
import { cn } from "@/lib/utils"
import { TSalesQuery } from "@/types/queries"
import { ArrowDownCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export const ProductSalesCards = ({
  query: [query, setQuery],
}: {
  query: TSalesQuery
}) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useProductSales(query)

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
          page.sales.map((sale) => (
            <Card
              key={sale.id}
              className={cn(
                "border-2",
                sale.status == "dispatched" && "bg-primary/10",
                sale.status == "to dispatch" && "bg-yellow-400/30"
              )}
            >
              <CardHeader className="py-1.5">
                <CardTitle>{sale.product.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-0.5">
                <div>
                  <strong>Valor:</strong> {maskMoney(sale.value)}
                </div>
                <div>
                  <strong>Data de Compra:</strong> {sale.added_at}
                </div>
                {sale.status == "dispatched" && (
                  <>
                    <div>
                      <strong>Data de Despacho:</strong> {sale.dispatched_at}
                    </div>
                    <div>
                      <strong>Despachado por:</strong>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-2 py-0 px-0.5 my-0"
                        asChild
                      >
                        <Link href={`/profile?userId=${sale.dispatched_by?.id}`}>
                          {sale.dispatched_by?.name}
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
        {data?.pages && data?.pages[0].sales.length === 0 && (
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
