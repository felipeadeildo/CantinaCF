import { getErrorMessage } from '@/lib/utils'
import { TRechargeSchema } from '@/schemas/recharge'
import axios, { AxiosError } from 'axios'

export const confirmRecharge = async (
  token: string | null,
  formData: TRechargeSchema
): Promise<{ message: string; paymentId?: number }> => {
  const { value, paymentMethod, targetUserId, observations } = formData
  const payload = {
    rechargeValue: value.toString(),
    paymentMethod,
    targetUserId: targetUserId || '',
    observations: observations || '',
  }

  try {
    const res = await axios.post('/api/recharge', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}
