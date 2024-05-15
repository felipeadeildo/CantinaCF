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
import { Badge } from "../ui/badge"

type Props = {
  user: TUser
}

export const UserInfos = ({ user }: Props) => {
  return (
    <div className="text-sm flex flex-wrap gap-3 items-center justify-center">
      {user.email && (
        <Badge className="flex gap-1 items-center" variant="outline">
          <Mail size={18} /> <span className="font-semibold">Email:</span>
          <span className="text-xs">{user.email}</span>
        </Badge>
      )}

      {user.cpf && (
        <Badge className="flex gap-1 items-center" variant="outline">
          <Fingerprint size={18} /> <span className="font-semibold">CPF:</span>
          {maskCPF(user.cpf)}
        </Badge>
      )}

      <Badge className="flex gap-1 items-center" variant="outline">
        <DollarSign size={18} /> <span className="font-semibold">Saldo:</span>
        <span className="text-green-500">{toReal(user.balance || 0)}</span>
      </Badge>

      {user.balance_payroll > 0 && (
        <Badge className="flex gap-1 items-center" variant="outline">
          <Banknote />
          <span className="font-semibold">Saldo Devedor:</span>
          <span className="text-red-500">{toReal(user.balance_payroll || 0)}</span>
        </Badge>
      )}

      {user.serie && (
        <Badge className="flex gap-1 items-center" variant="outline">
          <School size={18} /> <span className="font-semibold">Série (Turma):</span>
          {user.serie} ({user.turm?.toUpperCase()})
        </Badge>
      )}

      {user.telephone && (
        <Badge className="flex gap-1 items-center" variant="outline">
          <Phone size={18} /> <span className="font-semibold">Telefone:</span>
          {maskPhone(user.telephone)}
        </Badge>
      )}

      <Badge className="flex gap-1 items-center" variant="outline">
        <UserPlus size={18} /> <span className="font-semibold">Data de Cadastro:</span>
        {user.added_at}
      </Badge>
    </div>
  )
}
