import { getErrorMessage } from "@/lib/utils"
import { SUser } from "@/schemas/user"
import { TUser } from "@/types/user"
import axios, { AxiosError } from "axios"

export const fetchUsers = async (
  token: string | null,
  query: string
): Promise<TUser[]> => {
  const res = await axios.get("/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query,
    },
  })

  return res.data.users
}

export const fetchUser = async (token: string | null, id: string): Promise<{message?: string; user?: TUser}> => {
  try {
    const res = await axios.get(`/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    })
    return res.data.user
  } catch (error: AxiosError | any) {
    return {message: getErrorMessage(error)}
  }

}

export const createUser = async (
  token: string | null,
  user: SUser
): Promise<{ message?: string; user?: TUser }> => {
  try {
    const res = await axios.post("/api/users", user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  } catch (e: AxiosError | any) {
    const error = getErrorMessage(e)
    return { message: error }
  }
}
