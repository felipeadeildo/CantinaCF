import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAttachUrl, toReal } from "@/lib/utils"
import { TPaymentRequest } from "@/types/recharge"
import { FileText, Unlock, XCircle } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export const PaymentRequest = ({ payment }: { payment: TPaymentRequest }) => {
  const { user } = payment
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{user.name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">Username: {user.username}</Badge>
          <Badge variant="outline">Saldo: {toReal(user.balance)}</Badge>
          <Badge variant="outline">Data: {payment.added_at}</Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-2">
        <Badge className="font-bold text-sm">
          {toReal(payment.value)} ({payment.payment_method})
        </Badge>
        {payment.observations && (
          <span className="text-sm text-center">
            <p className="font-bold">Observação do Usuário:</p>
            <p className="italic">&quot;{payment.observations}&quot;</p>
          </span>
        )}
        {payment.is_paypayroll && (
          <Badge variant="outline">Pagamento de Folha de Pagamento</Badge>
        )}
      </CardContent>

      <CardFooter className="grid gap-3 ">
        {payment.proof_path && (
          <Button variant="link">
            <a
              href={getAttachUrl(payment.proof_path)}
              className="flex gap-1 items-center"
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={18} />
              Ver comprovante
            </a>
          </Button>
        )}

        <Button className="gap-1">
          <Unlock size={18} />
          Liberar Saldo
        </Button>
        <Button variant="destructive" className="gap-1">
          <XCircle size={18} />
          Cancelar Pagamento
        </Button>
      </CardFooter>
    </Card>
  )
}
