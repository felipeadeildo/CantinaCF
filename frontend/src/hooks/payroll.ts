import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import { settlePayroll } from "@/services/settle-payroll"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const usePayrollMutation = () => {
  const { token } = useAuth()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const settlementMutation = useMutation({
    mutationFn: ({ userId, value }: { userId: number; value: number }) =>
      settlePayroll(token, userId, value),
    mutationKey: ["payroll"],

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
        description: data.message,
      })

      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return { settlementMutation }
}
