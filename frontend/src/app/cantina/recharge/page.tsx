'use client'

import { LoginRequired } from '@/components/login-required'
import { RechargeForm } from '@/components/recharge/form'
import { PixDetails } from '@/components/recharge/pix_details'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/auth'
import { usePayments } from '@/hooks/payments'
import { TPaymentRequest } from '@/types/recharge'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const Recharge = () => {
  const { user } = useAuth()
  const { data: paymentsPages } = usePayments({
    userId: user?.id,
    status: 'to allow',
    paymentMethodIds: [1],
  })
  const queryClient = useQueryClient()

  const [pixPendingPayment, setPixPendingPayment] =
    useState<TPaymentRequest | null>(null)

  useEffect(() => {
    if (!user) return
    const timer = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    }, 5000)

    return () => clearInterval(timer)
  }, [queryClient, user])

  useEffect(() => {
    if (paymentsPages && paymentsPages.pages[0].payments.length > 0) {
      setPixPendingPayment(paymentsPages.pages[0].payments[0])
    }

    return () => setPixPendingPayment(null)
  }, [paymentsPages])

  return (
    <div className="flex justify-center items-center h-[80dvh]">
      <Card>
        <CardHeader className="py-1">
          <CardTitle className="text-center">Recarregar Saldo</CardTitle>
          <CardDescription className="text-center">
            {pixPendingPayment
              ? 'Aguardando pagamento...'
              : 'Recarregue seu saldo na cantina para poder comprar lanches!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pixPendingPayment ? <PixDetails payment={pixPendingPayment} /> : <RechargeForm />}
        </CardContent>
      </Card>
    </div>
  )
}

const ProtectedRecharge = () => {
  return (
    <LoginRequired>
      <Recharge />
    </LoginRequired>
  )
}

export default ProtectedRecharge
