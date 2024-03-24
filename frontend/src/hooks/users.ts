import { useAuth } from "@/contexts/auth"
import { SUser } from "@/schemas/user"
import { createUser, fetchUser, fetchUsers } from "@/services/users"
import { TUser } from "@/types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
  return useQuery<{ user?: TUser }>({
    queryKey: ["user", id],
    queryFn: () => fetchUser(token, id),
    enabled: !!token,
  })
}

export const useUsersMutations = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const createUserMutation = useMutation({
    mutationFn: (user: SUser) => createUser(token, user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })

  return { createUserMutation }
}
