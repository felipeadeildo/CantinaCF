import { UserRoles } from "@/types/user"
import { z } from "zod"

const userSchemaBase = z.object({
  name: z.string({ required_error: "Por favor, insira o Nome" }),
  username: z.string({ required_error: "Por favor, insira o Nome de Usuário." }),
  password: z
    .string({ required_error: "Por favor, insira senha." })
    .min(4, "Senha tem no mínimo 4 caracteres."),
  role_id: z.union([
    z.literal(UserRoles.Admin),
    z.literal(UserRoles.Funcionário),
    z.literal(UserRoles.Caixa),
    z.literal(UserRoles.Aluno),
  ]),
})

const studentSchema = z.object({
  matricula: z
    .string({ required_error: "Por favor, insira a matricula." })
    .min(4, "Matricula tem no mínimo 4 caracteres."),
  serie: z
    .string({ required_error: "Por favor, insira a serie." })
    .min(1, "Série tem no mínimo 1 caractere."),
  turm: z.string({ required_error: "Por favor, insira a turma." }),
})

export const userSchema = z.lazy(() =>
  z.union([
    userSchemaBase
      .extend({
        role_id: z.literal(UserRoles.Aluno),
      })
      .merge(studentSchema),
    userSchemaBase.extend({
      role_id: z.union([
        z.literal(UserRoles.Admin),
        z.literal(UserRoles.Funcionário),
        z.literal(UserRoles.Caixa),
      ]),
    }),
  ])
)

export type SUser = z.infer<typeof userSchema>
