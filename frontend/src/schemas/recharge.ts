import { sanitizeFMoney } from '@/lib/masks'
import { PaymentMethods } from '@/types/recharge'
import { z } from 'zod'

export const rechargeSchema = z.object({
  value: z.preprocess(
    (value) =>
      typeof value === 'string' ? parseFloat(sanitizeFMoney(value)) : value,
    z
      .number({ required_error: 'Por favor, insira o valor.' })
      .min(0.01, 'O valor tem que ser maior que 0.01')
  ),
  paymentMethod: z.union([
    z.literal(PaymentMethods.PIX),
    z.literal(PaymentMethods.CREDIT_CARD),
    z.literal(PaymentMethods.DEBIT_CARD),
    z.literal(PaymentMethods.CASH),
    z.literal(PaymentMethods.PAYROLL),
  ]),
  observations: z.string().optional(),
  targetUserId: z.string(),
})

export type TRechargeSchema = z.infer<typeof rechargeSchema>
