"use client"

import { LoginRequired } from "@/components/login-required"
import { PaymentRequest } from "@/components/payments/payment-request"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePaymentRequests } from "@/hooks/payments"
import { Loader2 } from "lucide-react"

const Payments = () => {
  const { data: payments = [], isLoading } = usePaymentRequests()
  return (
    <div>
      <h1 className="text-xl my-4 text-center">Verificação de Pagamentos</h1>

      {isLoading && (
        <div className="flex justify-center items-center mt-32">
          <Loader2 className="animate-spin" />
          <span className="text-xl ml-2">Carregando...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {payments.map((payment) => (
          <PaymentRequest key={payment.id} payment={payment} />
        ))}
      </div>

      {payments.length === 0 && (
        <Alert className="w-8/12 mx-auto">
          <AlertDescription className="text-center">
            Nenhum pedido de pagamento até o momento!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

const ProtectedPayments = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <Payments />
    </LoginRequired>
  )
}

export default ProtectedPayments
