import { AlertCircleIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const PaymentNotFound = () => {
  return (
    <div className="flex justify-center items-center h-[80dvh]">
      <Card className="w-full max-w-md bg-secondary text-secondary-foreground">
        <CardHeader className="flex justify-center">
          <AlertCircleIcon className="w-12 h-12 text-red-600" />
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle className="text-xl text-red-600">
            Pagamento não encontrado!
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  )
}
