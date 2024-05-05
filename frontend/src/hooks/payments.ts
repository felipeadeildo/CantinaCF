import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import { getBackendUrl } from "@/lib/utils"
import { acceptOrDenyPayment } from "@/services/payment"
import { TPaymentRequest } from "@/types/recharge"
import { useMutation } from "@tanstack/react-query"
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

export const usePaymentMutation = () => {
  const { token } = useAuth()
  const { toast } = useToast()

  const acceptOrDenyPaymentMutation = useMutation({
    mutationFn: ({ payment, accept }: {payment: TPaymentRequest, accept: boolean}) =>
      acceptOrDenyPayment(token, payment.id, accept),
    onSuccess: (data) =>
      toast({
        title: "Sucesso",
        description: data.message,
      }),
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
