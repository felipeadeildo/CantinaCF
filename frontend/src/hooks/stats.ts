import { useAuth } from "@/contexts/auth"
import { fetchProductSalesStats, fetchStats } from "@/services/stats"
import { TBSalesQuery, TBStatsQuery } from "@/types/queries"
import { useQuery } from "@tanstack/react-query"

export const useStats = (query: TBStatsQuery) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["stats", query],
    queryFn: () => fetchStats(token, query),
    enabled: !!token,
  })
}


export const useProductSalesStats = (query: TBSalesQuery) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["product-sales-stats", query],
    queryFn: () => fetchProductSalesStats(token, query),
    enabled: !!token,
  })
}