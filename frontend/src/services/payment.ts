import { getErrorMessage } from "@/lib/utils"
import axios, { AxiosError } from "axios"

export const acceptOrDenyPayment = async (
  token: string | null,
  paymentId: number,
  accept: boolean
): Promise<{ message: string }> => {
  try {
    const res = await axios.put(
      "/api/recharge",
      { id: paymentId, accept },
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
