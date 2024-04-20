import { getBackendUrl } from "@/lib/utils"
import { TProductSale } from "@/types/products"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

export const useProductDispatch = () => {
  const [productSales, setProductSales] = useState<TProductSale[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    const socket: Socket = io(getBackendUrl() + "/products_dispatch", {
      transports: ["websocket"],
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
