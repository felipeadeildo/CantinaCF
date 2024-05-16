import { getErrorMessage } from "@/lib/utils"
import { TBStatsQuery } from "@/types/queries"
import { TStats } from "@/types/stats"
import axios, { AxiosError } from "axios"

export const fetchStats = async (
  token: string | null,
  query: TBStatsQuery
): Promise<TStats> => {
  try {
    const res = await axios.get("/api/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: query,
    })

    return res.data
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}
