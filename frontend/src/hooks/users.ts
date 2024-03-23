import { useAuth } from "@/contexts/auth"
import { fetchUser, fetchUsers } from "@/services/users"
import { TUser } from "@/types/user"
import { useQuery } from "@tanstack/react-query"

export const useUsers = (query: string) => {
  const { token } = useAuth()
  return useQuery<TUser[]>({
    queryKey: ["users", query],
    queryFn: () => fetchUsers(token, query),
    enabled: !!token,
  })
}

export const useUser = (id: string) => {
  const { token } = useAuth()
  return useQuery<TUser>({
    queryKey: ["user", id],
    queryFn: () => fetchUser(token, id),
    enabled: !!token,
  })
}
