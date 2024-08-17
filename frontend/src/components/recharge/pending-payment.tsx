import { PAYMENT_METHODS_LABELS } from '@/constants/translations'
import { TPaymentRequest } from '@/types/recharge'
import { PaymentCard } from '../profile/payment-card'
import { PixDetails } from './pix-details'

export const PendingPayment = ({ payment }: { payment: TPaymentRequest }) => {
  return payment.payment_method === PAYMENT_METHODS_LABELS.PIX ? (
    <PixDetails payment={payment} />
  ) : (
    <PaymentCard payment={payment} isPending />
  )
}
