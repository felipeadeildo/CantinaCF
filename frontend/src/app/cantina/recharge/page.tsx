'use client'

import { LoginRequired } from '@/components/login-required'
import { RechargeForm } from '@/components/recharge/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/auth'
import { usePayments } from '@/hooks/payments'
import { PaymentMethods } from '@/types/recharge'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Recharge = () => {
  const { user } = useAuth()
  const router = useRouter()

  const { data: paymentsPages } = usePayments({
    userId: user?.id,
    status: 'to allow',
    paymentMethodIds: [Number(PaymentMethods.PIX)],
  })

  const [pixPaymentPending, setPixPaymentPending] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (
      paymentsPages &&
      paymentsPages.pages &&
      paymentsPages.pages[0] &&
      paymentsPages.pages[0].payments &&
      paymentsPages.pages[0].payments.length > 0
    ) {
      setPixPaymentPending(true)
    }
  }, [paymentsPages])

  useEffect(() => {
    if (!pixPaymentPending) return

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [pixPaymentPending])

  useEffect(() => {
    if (countdown === 0 && paymentsPages?.pages?.[0]?.payments?.[0]?.id) {
      router.push(`/cantina/recharge/${paymentsPages.pages[0].payments[0].id}`)
    }
  }, [countdown, paymentsPages, router])

  return (
    <div className="flex justify-center items-center h-[80dvh]">
      {pixPaymentPending ? (
        <h1 className="text-xl my-2 text-center">
          Você tem um pagamento PIX em andamento... aguarde {countdown}{' '}
          segundos...
        </h1>
      ) : (
        <Card className="w-full max-w-md text-secondary-foreground">
          <CardHeader className="py-1">
            <CardTitle className="text-center text-2xl">
              Recarregar Saldo
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Recarregue seu saldo na cantina para poder comprar lanches!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RechargeForm />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const ProtectedRecharge = () => (
  <LoginRequired>
    <Recharge />
  </LoginRequired>
)

export default ProtectedRecharge
