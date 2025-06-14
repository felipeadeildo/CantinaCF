'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { maskMoney } from '@/lib/masks'
import { newProductSchema } from '@/schemas/product'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

type CreateProductFormData = z.infer<typeof newProductSchema>

interface CreateProductFormProps {
  form: UseFormReturn<CreateProductFormData>
}

export function CreateProductForm({ form }: CreateProductFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Produto</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do produto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor (R$)</FormLabel>
            <FormControl>
              <Input
                placeholder="0,00"
                {...field}
                value={field.value ? maskMoney(field.value) : ''}
                onChange={(e) => {
                  const value = e.target.value
                  const numericValue = value.replace(/\D/g, '')
                  field.onChange(numericValue ? Number(numericValue) / 100 : 0)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="1"
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
