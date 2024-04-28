import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useProductsMutation } from "@/hooks/products"
import { maskMoney } from "@/lib/masks"
import { NewProductFormInputs, newProductSchema } from "@/schemas/product"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"

export const CreateProductForm = () => {
  const form = useForm<NewProductFormInputs>({
    resolver: zodResolver(newProductSchema),
  })

  const { createProductMutation } = useProductsMutation()

  const onSubmit = (data: NewProductFormInputs) => {
    createProductMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="items-center gap-2 grid grid-cols-1 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field: { onChange, ...props } }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                Valor do Produto (R$)
                <FormDescription className="text-xs">por unidade</FormDescription>
              </FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    onChange(maskMoney(e.target.value))
                  }}
                  {...props}
                />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                Quantidade
                <FormDescription className="text-xs">Unidades</FormDescription>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ammountPaid"
          render={({ field: { onChange, ...props } }) => (
            <FormItem>
              <FormLabel>Valor Pago (R$)</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    onChange(maskMoney(e.target.value))
                  }}
                  {...props}
                />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className="flex justify-between">
                Observações
                <FormDescription className="text-xs">
                  Alguma anotação caso deseje
                </FormDescription>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs text-end" />
            </FormItem>
          )}
        />

        <Button type="submit" className="sm:col-span-2 mt-6">
          Criar Produto
        </Button>
      </form>
    </Form>
  )
}
