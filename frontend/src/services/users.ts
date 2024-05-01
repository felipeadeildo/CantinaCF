import { getErrorMessage } from "@/lib/utils"
import { SUser, SUserWithoutPassword } from "@/schemas/user"
import { TUser, TUserUpdatePassword } from "@/types/user"
import axios, { AxiosError } from "axios"

export const fetchUsers = async (
  token: string | null,
  query: string,
  onlyBalance?: boolean,
  onlyBalancePayroll?: boolean
): Promise<TUser[]> => {
  const res = await axios.get("/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query,
      onlyBalance,
      onlyBalancePayroll,
    },
  })

  return res.data.users
}

export const fetchUser = async (
  token: string | null,
  id: string
): Promise<{ message?: string; user?: TUser }> => {
  try {
    const res = await axios.get(`/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    })
    return { user: res.data.user }
  } catch (error: AxiosError | any) {
    return { message: getErrorMessage(error) }
  }
}

export const createUser = async (
  token: string | null,
  user: SUser
): Promise<{ message?: string; user?: TUser }> => {
  try {
    const res = await axios.post("/api/user", user, {
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

export const updateUser = async (
  token: string | null,
  user: SUserWithoutPassword | TUserUpdatePassword,
  updateType: "info" | "password"
): Promise<{ message?: string; user?: TUser }> => {
  try {
    const res = await axios.put(`/api/user?type=${updateType}`, user, {
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
