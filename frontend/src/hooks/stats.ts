import { useAuth } from "@/contexts/auth"
import { fetchStats } from "@/services/stats"
import { TBStatsQuery } from "@/types/queries"
import { useQuery } from "@tanstack/react-query"

export const useStats = (query: TBStatsQuery) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["stats", query],
    queryFn: () => fetchStats(token, query),
    enabled: !!token,
  })
}
