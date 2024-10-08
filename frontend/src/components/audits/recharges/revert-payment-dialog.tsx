import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePaymentMutation } from '@/hooks/payments'
import { maskMoney } from '@/lib/masks'
import { TPaymentRequest } from '@/types/recharge'
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Undo,
} from 'lucide-react'
import React, { useMemo } from 'react'

const RevertPaymentDialog = ({ payment }: { payment: TPaymentRequest }) => {
  const { revertPaymentMutation } = usePaymentMutation()

  const handleRevertPayment = () => {
    revertPaymentMutation.mutate(payment)
  }

  const canCoverFullAmount = useMemo(() => {
    return payment.value <= payment.user.balance
  }, [payment])
  const difference = useMemo(() => {
    return payment.value - payment.user.balance
  }, [payment])

  const isPayrollPayment = useMemo(() => {
    return payment.payment_method === 'Folha de Pagamento'
  }, [payment])

  const isPaymentRejected = useMemo(() => {
    return payment.status === 'rejected'
  }, [payment])

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                disabled={
                  isPayrollPayment || isPaymentRejected || payment.is_paypayroll
                }
              >
                <Undo className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {isPayrollPayment ? (
              <p className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                No momento, não é possível fazer reversão de pagamentos do tipo
                folha de pagamento.
              </p>
            ) : isPaymentRejected ? (
              <p className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Pagamento já foi rejeitado, não precisa ser revertido.
              </p>
            ) : payment.is_paypayroll ? (
              <p className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                No momento, não é possível reverter baixa na folha de pagamento.
              </p>
            ) : (
              <p>
                Reverter pagamento de {payment.user.username} de{' '}
                {maskMoney(payment.value)}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" /> Reversão de Pagamento
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="border-l-4 border-destructive p-4 bg-destructive/10 rounded">
              <h3 className="text-base font-semibold flex items-center mb-2">
                <AlertTriangle className="mr-2 h-4 w-4" /> O que vai acontecer:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  O pagamento de{' '}
                  <span className="font-medium">
                    {maskMoney(payment.value)}
                  </span>{' '}
                  será marcado como{' '}
                  <span className="text-destructive font-medium">
                    rejeitado
                  </span>
                  .
                </li>
                <li>
                  Tentaremos remover esse valor do saldo atual de{' '}
                  <span className="font-medium">{payment.user.name}</span>.
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-primary p-4 bg-primary/10 rounded">
              <h3 className="text-base font-semibold flex items-center mb-2">
                <AlertCircle className="mr-2 h-4 w-4" /> Situação atual:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Saldo atual de {payment.user.name}:{' '}
                  <span className="font-medium">
                    {maskMoney(payment.user.balance)}
                  </span>
                </li>
                <li>
                  Valor a ser revertido:{' '}
                  <span className="font-medium">
                    {maskMoney(payment.value)}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-muted-foreground p-4 bg-muted rounded">
              <h3 className="text-base font-semibold flex items-center mb-2">
                <AlertCircle className="mr-2 h-4 w-4" /> Resultado após a
                reversão:
              </h3>
              {canCoverFullAmount ? (
                <p className="text-sm">
                  O valor total de{' '}
                  <span className="font-medium">
                    {maskMoney(payment.value)}
                  </span>{' '}
                  será removido do saldo.
                  <br />
                  Novo saldo:{' '}
                  <span className="font-medium">
                    {maskMoney(payment.user.balance - payment.value)}
                  </span>
                </p>
              ) : (
                <div className="text-sm">
                  <p className="font-medium mb-1">
                    O saldo atual não é suficiente para cobrir o valor total da
                    reversão.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="flex items-center">
                      <ArrowDown className="mr-2 h-4 w-4" />{' '}
                      <span>O saldo será zerado (R$ 0,00)</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowUp className="mr-2 h-4 w-4" />{' '}
                      <span>
                        A diferença de{' '}
                        <span className="font-medium">
                          {maskMoney(difference)}
                        </span>{' '}
                        será adicionada como saldo devedor
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={revertPaymentMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevertPayment}
            disabled={revertPaymentMutation.isPending}
          >
            <Undo className="mr-2 h-4 w-4" />
            {revertPaymentMutation.isPending
              ? 'Revertendo...'
              : 'Confirmar Reversão'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RevertPaymentDialog
