export const UserRoles = {
  Admin: "1",
  Funcionário: "2",
  Aluno: "3",
  Caixa: "4",
} as const

export type TUser = {
  id: number
  username: string
  name: string
  matricula: number
  role_id: number
  balance: number
  balance_payroll: number
  serie: string // TODO: ENUM
  turm: string // TODO: ENUM
  telephone: string
  cpf: string
  email: string
  added_at: string
  updated_at: string
}
// Assim como ta vindo da API
