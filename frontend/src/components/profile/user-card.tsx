import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/auth"
import { maskCPF, maskPhone } from "@/lib/masks"
import { isUserAdmin, toReal } from "@/lib/utils"
import { TUser } from "@/types/user"
import {
  Banknote,
  DollarSign,
  Fingerprint,
  Lock,
  Mail,
  Pen,
  Phone,
  School,
  UserPlus,
} from "lucide-react"
import { Button } from "../ui/button"

type Props = {
  user: TUser
}

export const UserCard = ({ user }: Props) => {
  const { user: currentUser } = useAuth()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{user.name}</CardTitle>
        <CardDescription className="text-center">
          Matrícula: {user.matricula} | Username: {user.username} | ID: {user.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {currentUser && (isUserAdmin(currentUser) || currentUser.id === user.id) && (
          <>
            <Button variant="secondary">
              <Pen className="mr-1 h-5 w-5" /> Editar
            </Button>

            <Button variant="outline">
              <Lock className="mr-1 h-5 w-5" /> Mudar Senha
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
