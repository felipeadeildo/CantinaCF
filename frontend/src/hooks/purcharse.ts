import { useAuth } from "@/contexts/auth"
import { LoginFormInputs } from "@/schemas/login"
import { confirmPurchase } from "@/services/products"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const usePurchaseMutation = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation<string, Error, LoginFormInputs>({
    mutationFn: (credentials) => confirmPurchase(token, credentials),
    mutationKey: ["purchase"],
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      queryClient.setQueryData(["cart"], () => [])

      queryClient.invalidateQueries({ queryKey: ["cart"] })
      queryClient.invalidateQueries({ queryKey: ["products", undefined], exact: false })
    },
  })
}
