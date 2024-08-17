import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoaderIcon } from 'lucide-react'

export const LoadingPayment = () => {
  return (
    <div className="flex justify-center items-center h-[80dvh]">
      <Card className="w-full max-w-md bg-secondary text-secondary-foreground">
        <CardHeader className="flex justify-center items-center">
          <LoaderIcon className="w-12 h-12 animate-spin text-primary" />
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle className="text-xl">Carregando pagamento...</CardTitle>
        </CardContent>
      </Card>
    </div>
  )
}
