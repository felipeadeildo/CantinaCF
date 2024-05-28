import { z } from "zod"

export const loginSchema = z.object({
  username: z.string({ required_error: "Por favor, insira seu nome de usuário." }),
  password: z
    .string({ required_error: "Por favor, insira sua senha." })
    .min(4, "Senha tem no mínimo 4 caracteres."),
})

export type LoginFormInputs = z.infer<typeof loginSchema>
