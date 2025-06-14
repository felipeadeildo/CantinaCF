'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useProductsMutation } from '@/hooks/products'
import { newProductSchema } from '@/schemas/product'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateProductForm } from './create-product-form'

type CreateProductFormData = z.infer<typeof newProductSchema>

export function CreateProductDialog() {
  const [open, setOpen] = useState(false)
  const { productStockMutation } = useProductsMutation()

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: '',
      value: 0,
      quantity: 1,
    },
  })

  const onSubmit = async (data: CreateProductFormData) => {
    await productStockMutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CreateProductForm form={form} />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={productStockMutation.isPending}>
                {productStockMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Criar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
