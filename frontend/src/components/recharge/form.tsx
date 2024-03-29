import { PAYMENT_METHODS_LABELS } from "@/constants/translations"
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

export const RechargeForm = () => {
  const form = useForm<TRechargeSchema>({
    resolver: zodResolver(rechargeSchema),
  })

  const proofRef = form.register("proof")

  const onSubmit = async (data: TRechargeSchema) => {
    console.log(data)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => (e.target.value = maskMoney(e.target.value))}
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
            <FormItem>
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
            <FormItem>
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
              <FormItem>
                <FormLabel>Comprovante</FormLabel>
                <FormControl>
                  <Input type="file" {...proofRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Recarregar</Button>
      </form>
    </Form>
  )
}
