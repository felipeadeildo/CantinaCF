import { useAuth } from "@/contexts/auth";
import { fetchAffiliates } from "@/services/affiliates";
import { TBStatsQuery } from "@/types/queries";
import { useQuery } from "@tanstack/react-query";



export const useAffiliates = (query: TBStatsQuery) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["affiliates", query],
    queryFn: () => fetchAffiliates(token, query),
    enabled: !!token,
  })
}