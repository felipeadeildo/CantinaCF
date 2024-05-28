import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePaymentMutation } from "@/hooks/payments"
import { cn, getAttachUrl, toReal } from "@/lib/utils"
import { TPaymentRequest } from "@/types/recharge"
import { FileText, Unlock, XCircle } from "lucide-react"
import Link from "next/link"

export const PaymentRequest = ({ payment }: { payment: TPaymentRequest }) => {
  const { user } = payment
  const { acceptOrDenyPaymentMutation } = usePaymentMutation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{user.name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">Username: {user.username}</Badge>
          <Badge variant="outline">Saldo: {toReal(user.balance)}</Badge>
          <Badge variant="outline">Saldo Devedor: {toReal(user.balance_payroll)}</Badge>
          <Badge variant="outline">Data: {payment.added_at}</Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-2 h-20">
        <Badge className="font-bold text-sm">
          {toReal(payment.value)} ({payment.payment_method})
        </Badge>

        {payment.payroll_receiver && (
          <div className="flex gap-2">
            <span className="text-sm">Devedor:</span>
            <Badge variant="destructive">
              <Link href={`/profile?userId=${payment.payroll_receiver.id}`}>
                {payment.payroll_receiver.name}
              </Link>
            </Badge>
          </div>
        )}
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

      <CardFooter className="grid gap-3">
        <Button variant="link" disabled={!payment.proof_path}>
          <a
            href={getAttachUrl(payment.proof_path)}
            className={cn(
              "flex gap-1 items-center",
              !payment.proof_path && "text-destructive"
            )}
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={18} />
            Ver comprovante
          </a>
        </Button>

        <Button
          className="gap-1"
          onClick={() => acceptOrDenyPaymentMutation.mutate({ payment, accept: true })}
          disabled={acceptOrDenyPaymentMutation.isPending}
        >
          <Unlock size={18} />
          Liberar Saldo
        </Button>
        <Button
          variant="destructive"
          className="gap-1"
          onClick={() => acceptOrDenyPaymentMutation.mutate({ payment, accept: false })}
          disabled={acceptOrDenyPaymentMutation.isPending}
        >
          <XCircle size={18} />
          Cancelar Pagamento
        </Button>
      </CardFooter>
    </Card>
  )
}
