import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import { confirmRecharge } from "@/services/recharge"
import { useMutation } from "@tanstack/react-query"

export const useRechargeMutation = () => {
  const { token } = useAuth()
  const { toast } = useToast()

  return useMutation<string, Error, FormData>({
    mutationFn: (formData) => confirmRecharge(token, formData),
    mutationKey: ["recharge"],
    onError: (err) => {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data,
      })
    },
  })
}
