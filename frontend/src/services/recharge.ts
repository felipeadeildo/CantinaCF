import { getErrorMessage } from "@/lib/utils"
import axios, { AxiosError } from "axios"

export const confirmRecharge = async (
  token: string | null,
  formData: FormData
): Promise<string> => {
  try {
    const res = await axios.post("/api/recharge", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data.message
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}
