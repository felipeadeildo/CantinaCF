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
