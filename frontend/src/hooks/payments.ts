import { useAuth } from "@/contexts/auth"
import { getBackendUrl } from "@/lib/utils"
import { TPaymentRequest } from "@/types/recharge"
import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"


export const usePayments = () => {
  const [payments, setPayments] = useState<TPaymentRequest[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { token } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    const socket: Socket = io(getBackendUrl() + "/payments", {
      transports: ["websocket"],
      query: {
        jwt: token,
      },
    })

    socket.connect()

    socket.on("payments", (data) => {
      setPayments(data.payments)
      setIsLoading(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  return { payments, isLoading }
}
