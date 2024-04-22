import { useAuth } from "@/contexts/auth"
import { getBackendUrl } from "@/lib/utils"
import { dispatchProductSales } from "@/services/products-dispatch"
import { TProductSale } from "@/types/products"
import { TUser } from "@/types/user"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

type TUserProductSalesGrouped = {
  user: TUser
  products: [number, TProductSale[]][]
}

export const useProductDispatch = () => {
  const [productSales, setProductSales] = useState<TUserProductSalesGrouped[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { token } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    const socket: Socket = io(getBackendUrl() + "/products_dispatch", {
      transports: ["websocket"],
      query: {
        jwt: token,
      },
    })
    socket.connect()

    socket.on("products_dispatch", (data) => {
      setProductSales(data.products_sales)
      setIsLoading(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return {
    productSales,
    isLoading,
  }
}

export const useProductSalesDispatchMutation = () => {
  const { token } = useAuth()

  const productSalesDispatch = useMutation({
    mutationFn: (userId: number) => dispatchProductSales(token, userId),
    mutationKey: ["products_dispatch"],
  })

  return { productSalesDispatch }
}
