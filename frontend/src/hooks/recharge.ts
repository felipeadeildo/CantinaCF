import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth'
import { TRechargeSchema } from '@/schemas/recharge'
import { confirmRecharge } from '@/services/recharge'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const useRechargeMutation = () => {
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation<
    { message: string; paymentId?: number },
    Error,
    TRechargeSchema
  >({
    mutationFn: (formData) => confirmRecharge(token, formData),
    mutationKey: ['recharge'],
    onError: (err) => {
      toast({
        title: 'Erro',
        description: err.message,
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      toast({
        title: 'Sucesso',
        description: data.message,
      })

      router.push(`/cantina/recharge/${data.paymentId}`)
    },
  })
}
