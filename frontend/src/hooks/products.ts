import { useAuth } from "@/contexts/auth"
import { fetchCart } from "@/services/cart"
import {
  addProductToCart,
  fetchProducts,
  removeProductFromCart,
} from "@/services/products"
import { TCart } from "@/types/cart"
import { TProduct } from "@/types/products"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProducts = (query: string) => {
  const { token } = useAuth()

  return useQuery<{ products?: TProduct[]; message?: string }>({
    queryFn: () => fetchProducts(token, query),
    queryKey: ["products", query],
    enabled: !!token,
  })
}

export const useCart = () => {
  const { token } = useAuth()

  return useQuery<TCart[]>({
    queryFn: () => fetchCart(token),
    queryKey: ["cart"],
    enabled: !!token,
  })
}

export const useProductsMutation = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const addProductToCartMutation = useMutation({
    mutationFn: (productId: number) => addProductToCart(token, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeProductFromCartMutation = useMutation({
    mutationFn: (productId: number) => removeProductFromCart(token, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  return { addProductToCartMutation, removeProductFromCartMutation }
}
