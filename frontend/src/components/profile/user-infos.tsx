import { maskCPF, maskPhone } from "@/lib/masks"
import { toReal } from "@/lib/utils"
import { TUser } from "@/types/user"
import {
  Banknote,
  DollarSign,
  Fingerprint,
  Mail,
  Phone,
  School,
  UserPlus,
} from "lucide-react"

type Props = {
  user: TUser
}

export const UserInfos = ({ user }: Props) => {
  return (
    <>
      {user.email && (
        <div className="flex gap-1 items-center">
          <Mail size={18} /> <span className="font-semibold">Email:</span>
          <span className="text-xs">{user.email}</span>
        </div>
      )}

      {user.cpf && (
        <div className="flex gap-1">
          <Fingerprint size={18} /> <span className="font-semibold">CPF:</span>
          {maskCPF(user.cpf)}
        </div>
      )}

      <div className="flex gap-1">
        <DollarSign size={18} /> <span className="font-semibold">Saldo:</span>
        <span className="text-green-500">{toReal(user.balance || 0)}</span>
      </div>

      {user.balance_payroll > 0 && (
        <div className="flex gap-1">
          <Banknote />
          <span className="font-semibold">Saldo Devedor:</span>
          <span className="text-red-500">{toReal(user.balance_payroll || 0)}</span>
        </div>
      )}

      {user.serie && (
        <div className="flex gap-1">
          <School size={18} /> <span className="font-semibold">Série (Turma):</span>
          {user.serie} ({user.turm.toUpperCase()})
        </div>
      )}

      {user.telephone && (
        <div className="flex gap-1">
          <Phone size={18} /> <span className="font-semibold">Telefone:</span>
          {maskPhone(user.telephone)}
        </div>
      )}

      <div className="flex gap-1">
        <UserPlus size={18} /> <span className="font-semibold">Data de Cadastro:</span>
        {new Date(user.added_at).toLocaleDateString("pt-BR")}
      </div>
    </>
  )
}
