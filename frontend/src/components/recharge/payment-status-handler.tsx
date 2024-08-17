import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TPaymentRequest } from '@/types/recharge'
import { CheckCircle2Icon, ClockIcon, XCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PendingPayment } from './pending-payment'

export const PaymentStatusHandler = ({
  payment,
}: {
  payment: TPaymentRequest
}) => {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [isCountingDown, setIsCountingDown] = useState(false)

  useEffect(() => {
    if (payment.status === 'accepted' || payment.status === 'rejected') {
      setIsCountingDown(true)
    }
  }, [payment.status])

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      if (payment.status === 'accepted') {
        router.push('/')
      } else if (payment.status === 'rejected') {
        router.push('/cantina/recharge')
      }
    }
  }, [countdown, isCountingDown, payment.status, router])

  return (
    <div className="flex justify-center items-center h-[90dvh]">
      <Card className="w-full max-w-sm bg-secondary text-secondary-foreground p-4">
        <CardHeader className="flex flex-col items-center justify-center space-y-2 text-center">
          {payment.status === 'accepted' && (
            <>
              <CheckCircle2Icon className="w-10 h-10 text-green-600" />
              <CardTitle className="text-md font-medium text-green-600">
                Pagamento Confirmado! Redirecionando em {countdown}...
              </CardTitle>
            </>
          )}
          {payment.status === 'rejected' && (
            <>
              <XCircleIcon className="w-10 h-10 text-red-600" />
              <CardTitle className="text-md font-medium text-red-600">
                Pagamento Rejeitado! Redirecionando em {countdown}...
              </CardTitle>
            </>
          )}
          {payment.status === 'to allow' && (
            <>
              <ClockIcon className="w-10 h-10 text-yellow-600" />
              <CardTitle className="text-md font-medium text-yellow-600">
                Aguardando confirmação de pagamento...
              </CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <PendingPayment payment={payment} />
        </CardContent>
      </Card>
    </div>
  )
}
