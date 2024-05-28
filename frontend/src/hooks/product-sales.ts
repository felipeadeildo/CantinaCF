import { useAuth } from "@/contexts/auth"
import { fetchProductSales } from "@/services/sales"
import { TBSalesQuery } from "@/types/queries"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useProductSales = (query: TBSalesQuery) => {
  const { token } = useAuth()

  return useInfiniteQuery({
    queryKey: ["product-sales", query],
    queryFn: ({ pageParam }) => fetchProductSales(token, query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!token,
  })
}
