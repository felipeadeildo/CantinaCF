import { getErrorMessage } from "@/lib/utils"
import { TBStatsQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import axios, { AxiosError } from "axios"

export const fetchAffiliates = async (
  token: string | null,
  query: TBStatsQuery & { current?: boolean }
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

export const addAffiliate = async (
  token: string | null,
  userId: number,
  forUserId: number
): Promise<{ message?: string }> => {
  try {
    const res = await axios.post(
      "/api/affiliates",
      { userId, forUserId },
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

export const removeAffiliate = async (
  token: string | null,
  userId: number,
  fromUserId: number,
): Promise<{ message?: string }> => {
  try {
    const res = await axios.delete("/api/affiliates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { userId, fromUserId },
    })

    return res.data
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}
