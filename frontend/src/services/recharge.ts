import { getErrorMessage } from '@/lib/utils'
import { TRechargeSchema } from '@/schemas/recharge'
import axios, { AxiosError } from 'axios'

export const confirmRecharge = async (
  token: string | null,
  formData: TRechargeSchema
): Promise<string> => {
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

    return res.data.message
  } catch (e) {
    throw Error(getErrorMessage(e as AxiosError))
  }
}
