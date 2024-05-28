import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { maskMoney } from "@/lib/masks"
import { cn, getAttachUrl } from "@/lib/utils"
import { TPaymentRequest } from "@/types/recharge"
import { FileText } from "lucide-react"
import Link from "next/link"

type Props = {
  payment: TPaymentRequest
  isPending?: boolean
}

export const PaymentCard = ({ payment, isPending = false }: Props) => {
  return (
    <Card
      key={payment.id}
      className={cn(
        "border-2",
        payment.status == "accepted" && "bg-primary/10",
        payment.status == "rejected" && "bg-destructive/30",
        payment.status == "to allow" && "bg-yellow-400/40"
      )}
    >
      <CardContent className={cn("grid gap-0.5", isPending && "text-xs px-1.5 py-1")}>
        {!isPending && (
          <div>
            <strong>
              {payment.status === "accepted" ? "Aceito por:" : "Rejeitado por:"}
            </strong>
            {payment.allowed_by_user ? (
              <Button variant="link" size="sm" className="h-2 py-0 px-1 my-0" asChild>
                <Link
                  href={`/profile?userId=${payment.allowed_by_user.id}`}
                  target="_blank"
                >
                  {payment.allowed_by_user.name}
                </Link>
              </Button>
            ) : (
              "Não Liberado ainda"
            )}
          </div>
        )}

        <div>
          <strong>Forma de Pagamento:</strong>
          {payment.proof_path ? (
            <Button variant="link" size="sm" className="h-2 py-0 px-1 my-0" asChild>
              <Link href={getAttachUrl(payment.proof_path)} target="_blank">
                <FileText size={16} className="mr-1" />
                {payment.payment_method}
              </Link>
            </Button>
          ) : (
            <span className="ml-1">{payment.payment_method}</span>
          )}
        </div>

        {payment.payroll_receiver && (
          <div>
            <strong>Recebedor do Saldo Devedor:</strong>
            <Button variant="link" size="sm" className="h-2 py-0 px-0.5 my-0" asChild>
              <Link
                href={`/profile?userId=${payment.payroll_receiver.id}`}
                target="_blank"
                className={cn(isPending && "text-xs")}
              >
                {payment.payroll_receiver.name}
              </Link>
            </Button>
          </div>
        )}
        <div>
          <strong>Valor:</strong> <span>{maskMoney(payment.value)}</span>
        </div>
        {payment.observations && (
          <div>
            <strong>Observação:</strong> {payment.observations}
          </div>
        )}
        <div>
          <strong>Data e Hora:</strong> {payment.added_at}
        </div>
      </CardContent>
    </Card>
  )
}
