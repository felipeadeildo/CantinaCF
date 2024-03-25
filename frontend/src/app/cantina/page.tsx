"use client"

import { LoginRequired } from "@/components/login-required"
import { TProductSale } from "@/types/products"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

// Hook personalizado para gerenciar a conexão Socket
function useProductSocket(url: string) {
  const [productSales, setProductSales] = useState<TProductSale[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Inicializa o socket somente uma vez e usa ref para manter a instância
    if (!socketRef.current) {
      const newSocket = io(url, {
        transports: ["websocket"],
      }).connect()

      socketRef.current = newSocket

      // Define o listener para 'products_dispatch'
      newSocket.on(
        "products_dispatch",
        ({ product_sales }: { product_sales: TProductSale[] }) => {
          console.log({ product_sales })
          setProductSales(product_sales)
        }
      )

      // Limpeza ao desmontar
      return () => {
        newSocket.disconnect()
      }
    }
  }, [url])

  return productSales
}

const Cantina = () => {
  const productSales = useProductSocket("http://localhost:5000/products_dispatch")

  return (
    <div>
      Produtos para Despache
      {productSales.map((sale) => (
        <div key={sale.id}>{sale.product.name}</div>
      ))}
    </div>
  )
}

const ProtectedCantina = () => (
  <LoginRequired allowed_roles={[1, 2, 4]}>
    <Cantina />
  </LoginRequired>
)

export default ProtectedCantina
