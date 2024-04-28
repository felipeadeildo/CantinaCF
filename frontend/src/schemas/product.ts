import { z } from "zod"

export const newProductSchema = z.object({
  name: z.string({ required_error: "Por favor, insira o nome do produto." }),
  // description: z.string({ required_error: "Por favor, insira a descrição do produto." }),
  value: z.preprocess((v) => {
    if (typeof v === "string") {
      return parseFloat(v.replace(".", "").replace(",", "."))
    }
    return v
  }, z.number({ required_error: "Por favor, insira o valor do produto." }).min(0.01)),
  quantity: z.preprocess((v) => {
    if (typeof v === "string") {
      return parseInt(v)
    }
    return v
  }, z.number({ required_error: "Por favor, insira a quantidade de produtos." }).min(1)),
  ammountPaid: z.preprocess((v) => {
    if (typeof v === "string") {
      return parseFloat(v.replace(".", "").replace(",", "."))
    }
    return v
  }, z.number({ required_error: "Por favor, insira o valor pago sobre o produto." }).min(0.01)),
  observations: z.string().optional(),
})

export type NewProductFormInputs = z.infer<typeof newProductSchema>
