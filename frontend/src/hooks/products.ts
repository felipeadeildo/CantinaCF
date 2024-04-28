import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import { NewProductFormInputs } from "@/schemas/product"
import { fetchCart } from "@/services/cart"
import {
  addProductToCart,
  createProduct,
  fetchProducts,
  removeProductFromCart,
  renameProduct,
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
  const { toast } = useToast()

  const addProductToCartMutation = useMutation({
    mutationFn: (productId: number) => addProductToCart(token, productId),
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      await queryClient.cancelQueries({ queryKey: ["products", undefined] })

      const previousCart = queryClient.getQueryData<TCart[]>(["cart"])
      queryClient.setQueryData<TCart[]>(["cart"], (oldCart) => {
        const item = (oldCart || []).find((item) => item.product.id === productId)
        if (!item) return oldCart

        return oldCart?.map((cartItem) => {
          if (cartItem.product.id === productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          }
          return cartItem
        })
      })

      const previousProductsQueries = queryClient.getQueriesData<TProduct[]>({
        queryKey: ["products"],
      })

      previousProductsQueries.forEach(([queryKey, oldProducts]) => {
        queryClient.setQueryData<{ products?: TProduct[]; message?: string }>(
          queryKey,
          (currentData) => {
            return {
              ...currentData,
              products: currentData?.products?.map((product) =>
                product.id === productId
                  ? { ...product, quantity: product.quantity - 1 }
                  : product
              ),
            }
          }
        )
      })

      // para possível rollback
      return { previousCart, previousProductsQueries }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart)
      context?.previousProductsQueries.forEach((queryKey, oldProducts) => {
        queryClient.setQueryData(queryKey, oldProducts)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", undefined], exact: false })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeProductFromCartMutation = useMutation({
    mutationFn: (productId: number) => removeProductFromCart(token, productId),
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      await queryClient.cancelQueries({ queryKey: ["products", undefined] })

      const previousCart = queryClient.getQueryData<TCart[]>(["cart"])
      queryClient.setQueryData<TCart[]>(["cart"], (oldCart) => {
        const item = (oldCart || []).find((item) => item.product.id === productId)
        if (!item) return oldCart

        return oldCart?.map((cartItem) => {
          if (cartItem.product.id === productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            }
          }
          return cartItem
        })
      })

      const previousProductsQueries = queryClient.getQueriesData<TProduct[]>({
        queryKey: ["products"],
      })

      previousProductsQueries.forEach(([queryKey, oldProducts]) => {
        queryClient.setQueryData<{ products?: TProduct[]; message?: string }>(
          queryKey,
          (currentData) => {
            return {
              ...currentData,
              products: currentData?.products?.map((product) =>
                product.id === productId
                  ? { ...product, quantity: product.quantity + 1 }
                  : product
              ),
            }
          }
        )
      })

      // para possível rollback
      return { previousCart, previousProductsQueries }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart)
      context?.previousProductsQueries.forEach((queryKey, oldProducts) => {
        queryClient.setQueryData(queryKey, oldProducts)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const renameProductMutation = useMutation({
    mutationFn: ({ productId, name }: { productId: number; name: string }) =>
      renameProduct(token, productId, name),
    // TODO: On Mutate get the products data and update it
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Sucesso",
        description: "Produto renomeado com sucesso!",
      })
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const createProductMutation = useMutation({
    mutationFn: (product: NewProductFormInputs) => createProduct(token, product),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Sucesso",
        description: data.message,
      })
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    addProductToCartMutation,
    removeProductFromCartMutation,
    renameProductMutation,
    createProductMutation,
  }
}
