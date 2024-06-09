import { useAuth } from "@/contexts/auth"
import { dispatchProductSales, fetchProductDispatch } from "@/services/products-dispatch"
import { TProductSale } from "@/types/products"
import { TUser } from "@/types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export type TUserProductSalesGrouped = {
  user: TUser
  products: [number, TProductSale[]][]
}

export const useProductDispatch = () => {
  const { token } = useAuth()

  return useQuery({
    queryFn: () => fetchProductDispatch(token),
    queryKey: ["products_dispatch"],
    enabled: !!token,
    refetchInterval: 5000,
  })
}

export const useProductSalesDispatchMutation = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const productSalesDispatch = useMutation({
    mutationFn: (userId: number) => dispatchProductSales(token, userId),
    mutationKey: ["products_dispatch"],

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products_dispatch"] })
    }
  })

  return { productSalesDispatch }
}
