import { useAuth } from "@/contexts/auth"
import { SUser, SUserWithoutPassword } from "@/schemas/user"
import { createUser, fetchUser, fetchUsers, updateUser } from "@/services/users"
import { TUser } from "@/types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUsers = (
  query: string,
  onlyBalance?: boolean,
  onlyBalancePayroll?: boolean
) => {
  const { token } = useAuth()
  return useQuery<TUser[]>({
    queryKey: ["users", query, onlyBalance, onlyBalancePayroll],
    queryFn: () => fetchUsers(token, query, onlyBalance, onlyBalancePayroll),
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

export const useUserMutation = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const createUserMutation = useMutation({
    mutationFn: (user: SUser) => createUser(token, user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })

  const updateUserMutation = useMutation({
    mutationFn: (user: SUserWithoutPassword) => updateUser(token, user),
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return { createUserMutation, updateUserMutation }
}
