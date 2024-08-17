'use client'

import { LoginRequired } from '@/components/login-required'
import { LoadingPayment } from '@/components/recharge/loading-payment'
import { PaymentNotFound } from '@/components/recharge/payment-not-found'
import { PaymentStatusHandler } from '@/components/recharge/payment-status-handler'
import { usePayments } from '@/hooks/payments'
import { TPaymentRequest } from '@/types/recharge'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const PendingRecharge = ({
  params,
}: {
  params: { paymentId: number }
}) => {
  const queryClient = useQueryClient()

  const { data: paymentsPages, isLoading } = usePayments({
    paymentId: params.paymentId,
  })

  const [pendingPayment, setPendingPayment] = useState<TPaymentRequest | null>(
    null
  )

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ['payments', { paymentId: params.paymentId }],
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [queryClient, params.paymentId])

  useEffect(() => {
    if (paymentsPages && paymentsPages.pages[0].payments.length > 0) {
      setPendingPayment(paymentsPages.pages[0].payments[0])
    } else if (!isLoading) {
      setPendingPayment(null)
    }
  }, [paymentsPages, isLoading])

  if (isLoading) {
    return <LoadingPayment />
  }

  if (pendingPayment === null) {
    return <PaymentNotFound />
  }

  return <PaymentStatusHandler payment={pendingPayment} />
}

const ProtectedPending = ({ params }: { params: { paymentId: number } }) => {
  return (
    <LoginRequired>
      <PendingRecharge params={params} />
    </LoginRequired>
  )
}

export default ProtectedPending
