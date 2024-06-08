import { TUserProductSalesGrouped } from "@/hooks/products-dispatch"
import { getErrorMessage } from "@/lib/utils"
import axios, { AxiosError } from "axios"

export const dispatchProductSales = async (
  token: string | null,
  userId: number
): Promise<{ message: string }> => {
  try {
    const res = await axios.post(
      "/api/dispatch",
      { user_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return res.data
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}

export const fetchProductDispatch = async (
  token: string | null
): Promise<TUserProductSalesGrouped[]> => {
  try {
    const res = await axios.get("/api/products_dispatch", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.products_sales
  } catch (e: AxiosError | any) {
    throw Error(getErrorMessage(e))
  }
}
