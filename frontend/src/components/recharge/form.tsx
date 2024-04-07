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

import { useToast } from "../ui/use-toast"

export const RechargeForm = () => {
  const { user, token } = useAuth()

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

  const { toast } = useToast()

  const proofRef = form.register("proof")

  const onSubmit = async (data: TRechargeSchema) => {
    const formData = new FormData()
    if (data.paymentMethod === PaymentMethods.PIX && data["proof"]) {
      formData.append("proof", data["proof"])
    }
    formData.append("rechargeValue", data.value.toString())
    formData.append("paymentMethod", data.paymentMethod)
    formData.append("targetUserId", data.targetUserId?.toString() || "")

    const res = await fetch("/api/recharge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
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
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Selecione uma forma de pagamento"
                      defaultValue="1"
                    />
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
                <Input {...field} />
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
                  <Input type="file" {...proofRef} />
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
                  <Input {...field} defaultValue={user?.id} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <input type="hidden" {...form.register("targetUserId")} value={user?.id} />
        )}

        <Button type="submit">Recarregar</Button>
      </form>
    </Form>
  )
}
