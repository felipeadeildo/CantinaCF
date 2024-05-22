import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth"
import { usePayments } from "@/hooks/payments"
import { useQueryClient } from "@tanstack/react-query"
import { BellDot } from "lucide-react"
import { useEffect } from "react"
import { PaymentCard } from "./profile/payment-card"

export const Pendings = () => {
  const { user } = useAuth()
  const { data: paymentsPages } = usePayments({ userId: user?.id, status: "to allow" })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return
    const timer = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    }, 10000)

    return () => clearInterval(timer)
  }, [queryClient, user])

  if (!user) return null

  if (!paymentsPages) return null

  if (paymentsPages.pages.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <BellDot size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 px-2 py-1">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-center">Recargas Pendentes</h4>
          </div>
          <div className="grid">
            {paymentsPages?.pages.map((page) =>
              page.payments.map((payment) => (
                <PaymentCard payment={payment} key={payment.id} isPending />
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
