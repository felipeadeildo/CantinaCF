import { getErrorMessage } from "@/lib/utils"
import { TProduct } from "@/types/products"
import { TBSalesQuery, TBStatsQuery } from "@/types/queries"
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

export const fetchProductSalesStats = async (
  token: string | null,
  query: TBSalesQuery
): Promise<{ product: TProduct; sales: number; spent: number }[]> => {
  try {
    const res = await axios.get("/api/product_sales_stats", {
      params: query,
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}
