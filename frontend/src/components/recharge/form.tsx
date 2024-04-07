import { PAYMENT_METHODS_LABELS } from "@/constants/translations"
import { useAuth } from "@/contexts/auth"
import { maskMoney } from "@/lib/masks"
import { rechargeSchema, TRechargeSchema } from "@/schemas/recharge"
import { PaymentMethods } from "@/types/recharge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

import { useRechargeMutation } from "@/hooks/recharge"
import { CreditCard, Loader } from "lucide-react"

export const RechargeForm = () => {
  const { user } = useAuth()

  const form = useForm<TRechargeSchema>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      value: undefined,
      paymentMethod: PaymentMethods.PIX,
      targetUserId: user?.id.toString() || "",
      proof: undefined,
      observations: undefined,
    },
  })
  const proofRef = form.register("proof")

  const rechargeMutation = useRechargeMutation()

  const onSubmit = async (data: TRechargeSchema) => {
    const formData = new FormData()
    if (data.paymentMethod === PaymentMethods.PIX && data["proof"]) {
      formData.append("proof", data["proof"])
    }
    formData.append("rechargeValue", data.value.toString())
    formData.append("paymentMethod", data.paymentMethod)
    formData.append("targetUserId", data.targetUserId?.toString() || "")
    formData.append("observations", data.observations || "")

    await rechargeMutation.mutateAsync(formData)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e: any) => {
                    e.target.value = maskMoney(e.target.value)
                    field.onChange(e)
                  }}
                  defaultValue="0,00"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Forma de Pagamento</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={PaymentMethods.PIX}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma forma de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(PaymentMethods)
                    .filter(([key, value]) => key !== "SYSTEM")
                    .map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {PAYMENT_METHODS_LABELS[key]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input {...field} disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("paymentMethod") === PaymentMethods.PIX && (
          <FormField
            control={form.control}
            name="proof"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Comprovante</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...proofRef}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {user?.role_id === 1 ? (
          <FormField
            control={form.control}
            name="targetUserId"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Alvo da Recarga (ID do Usuário)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={form.formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <input type="hidden" {...form.register("targetUserId")} value={user?.id} />
        )}

        <Button
          type="submit"
          className="flex gap-1 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <CreditCard />
              Recarregar
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
