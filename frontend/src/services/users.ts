import { TUser } from "@/types/user"
import axios from "axios"

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

export const fetchUser = async (token: string | null, id: string): Promise<TUser> => {
  const res = await axios.get(`/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      id,
    },
  })

  return res.data.user
}
