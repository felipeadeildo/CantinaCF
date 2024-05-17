import { getErrorMessage } from "@/lib/utils"
import { TBStatsQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import axios, { AxiosError } from "axios"

export const fetchAffiliates = async (
  token: string | null,
  query: TBStatsQuery
): Promise<TUser[]> => {
  try {
    const res = await axios.get("/api/affiliates", {
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
