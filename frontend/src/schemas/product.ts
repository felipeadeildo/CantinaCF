import { sanitizeFMoney } from "@/lib/masks"
import { z } from "zod"

export const productSchema = z.object({
  id: z.preprocess((v) => (typeof v === "string" ? parseInt(v) : v), z.number().min(1)),
  quantity: z.preprocess(
    (v) => (typeof v === "string" ? parseInt(v) : v),
    z.number({ required_error: "Por favor, insira a quantidade de produtos." }).min(1)
  ),
  ammountPaid: z.preprocess((v) => {
    if (typeof v === "string") {
      return parseFloat(sanitizeFMoney(v))
    }
    return v
  }, z.number({ required_error: "Por favor, insira o valor pago sobre o produto." }).min(0.01)),
  observations: z.string().optional(),
})

export const newProductSchema = productSchema.omit({ id: true }).merge(
  z.object({
    name: z.string({ required_error: "Por favor, insira o nome do produto." }),
    value: z.preprocess(
      (v) => (typeof v === "string" ? parseFloat(sanitizeFMoney(v)) : v),
      z.number({ required_error: "Por favor, insira o valor do produto." }).min(0.01)
    ),
  })
)

type NewProductFormInputs = z.infer<typeof newProductSchema>

type ProductFormInputs = z.infer<typeof productSchema>

export type ProductStockInput = NewProductFormInputs | ProductFormInputs
