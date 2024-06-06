import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import {
  acceptOrDenyPayment,
  fetchPaymentMethods,
  fetchPayments,
} from "@/services/payment"
import { TBRechargesQuery } from "@/types/queries"
import { TPaymentRequest } from "@/types/recharge"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"


export const useWsPayments = () => {
  const [payments, setPayments] = useState<TPaymentRequest[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { token } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    const socket: Socket = io("http://localhost:8000/socket.io/payments", {
      transports: ["websocket"],
      query: {
        jwt: token,
      },
    })

    socket.connect()

    const pintInterval = setInterval(() => {
      socket.emit("ping")
    }, 10000)

    socket.on("payments", (data) => {
      setPayments(data.payments)
      setIsLoading(false)
    })

    socket.on("disconnect", () => {
      clearInterval(pintInterval)
    })

    return () => {
      clearInterval(pintInterval)
      socket.disconnect()
    }
  }, [token])

  return { payments, isLoading }
}

export const usePaymentMutation = () => {
  const { token } = useAuth()
  const { toast } = useToast()

  const acceptOrDenyPaymentMutation = useMutation({
    mutationFn: ({ payment, accept }: { payment: TPaymentRequest; accept: boolean }) =>
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
