import { getErrorMessage } from "@/lib/utils"
import axios, { AxiosError } from "axios"

export const settlePayroll = async (
  token: string | null,
  userId: number,
  value: number
): Promise<{ message: string }> => {
  try {
    const res = await axios.post(
      "/api/payroll",
      { user_id: userId, value },
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
