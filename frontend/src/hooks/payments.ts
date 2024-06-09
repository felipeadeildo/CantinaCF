import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import {
  acceptOrDenyPayment,
  fetchPaymentMethods,
  fetchPaymentRequests,
  fetchPayments,
} from "@/services/payment"
import { TBRechargesQuery } from "@/types/queries"
import { TPaymentRequest } from "@/types/recharge"
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

export const usePaymentRequests = () => {
  const { token } = useAuth()

  return useQuery({
    queryFn: () => fetchPaymentRequests(token),
    queryKey: ["payment-requests"],
    enabled: !!token,
    refetchInterval: 5000,
  })
}

export const usePaymentMutation = () => {
  const { token } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const acceptOrDenyPaymentMutation = useMutation({
    mutationFn: ({ payment, accept }: { payment: TPaymentRequest; accept: boolean }) =>
      acceptOrDenyPayment(token, payment.id, accept),
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message,
      })

      queryClient.invalidateQueries({ queryKey: ["payment-requests"] })
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      }),
  })

  return {
    acceptOrDenyPaymentMutation,
  }
}

export const usePaymentMethods = () => {
  const { token } = useAuth()
  return useQuery({
    queryFn: () => fetchPaymentMethods(token),
    queryKey: ["payment_methods"],
    enabled: !!token,
  })
}

export const usePayments = (query: TBRechargesQuery) => {
  const { token } = useAuth()

  return useInfiniteQuery({
    queryKey: ["payments", query],
    queryFn: ({ pageParam }) => fetchPayments(token, query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!token,
  })
}
