import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import { addAffiliate, fetchAffiliates, removeAffiliate } from "@/services/affiliates"
import { TBStatsQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAffiliates = (query: TBStatsQuery & { current?: boolean }) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["affiliates", query],
    queryFn: () => fetchAffiliates(token, query),
    enabled: !!token,
  })
}

export const useAffiliatesMutation = () => {
  const { token } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const addAffiliateMutation = useMutation({
    mutationFn: ({ user, forUser }: { user: TUser; forUser: TUser }) =>
      addAffiliate(token, user.id, forUser.id),
    mutationKey: ["add_affiliate"],
    onSuccess: ({ message }) => {
      toast({
        title: "Sucesso",
        description: message,
      })

      queryClient.invalidateQueries({ queryKey: ["affiliates"] })
    },

    onError: (err) => {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const removeAffiliateMutation = useMutation({
    mutationFn: ({ user, fromUser }: { user: TUser; fromUser: TUser }) =>
      removeAffiliate(token, user.id, fromUser.id),
    mutationKey: ["remove_affiliate"],
    onSuccess: ({ message }) => {
      toast({
        title: "Sucesso",
        description: message,
      })

      queryClient.invalidateQueries({ queryKey: ["affiliates"] })
    },

    onError: (err) => {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  return {
    addAffiliateMutation,
    removeAffiliateMutation,
  }
}
