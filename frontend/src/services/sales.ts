import { getErrorMessage } from "@/lib/utils"
import { TProductSale } from "@/types/products"
import { TBSalesQuery } from "@/types/queries"
import axios, { AxiosError } from "axios"

type SalesPage = {
  nextPage: number | null
  sales: TProductSale[]
}

export const fetchProductSales = async (
  token: string | null,
  query: TBSalesQuery,
  page?: number
): Promise<SalesPage> => {
  try {
    const res = await axios.get("/api/product_sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { ...query, page },
    })
    return res.data
  } catch (e: AxiosError | any) {
    throw Error(getErrorMessage(e))
  }
}
