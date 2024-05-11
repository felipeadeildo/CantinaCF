import { useAuth } from "@/contexts/auth"
import { SUser, SUserWithoutPassword } from "@/schemas/user"
import { createUser, fetchUser, fetchUsers, updateUser } from "@/services/users"
import { TUser, TUserUpdatePassword } from "@/types/user"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUsers = (
  query: string,
  onlyBalance?: boolean,
  onlyBalancePayroll?: boolean,
) => {
  const { token } = useAuth()
  return useInfiniteQuery({
    queryKey: ["users", query, onlyBalance, onlyBalancePayroll],
    queryFn: ({ pageParam }) => fetchUsers(token, query, onlyBalance, onlyBalancePayroll, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!token,
  })
}

export const useUser = (id: string) => {
  const { token } = useAuth()
  return useQuery<{ user?: TUser }>({
    queryKey: ["user", parseInt(id)],
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
    mutationFn: (user: SUserWithoutPassword) => updateUser(token, user, "info"),
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const updateUserPasswordMutation = useMutation({
    mutationFn: (user: TUserUpdatePassword) => updateUser(token, user, "password"),
  })

  return { createUserMutation, updateUserMutation, updateUserPasswordMutation }
}
