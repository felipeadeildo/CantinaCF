import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toReal } from '@/lib/utils'
import { CircleDollarSign, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

type CartStatsProps = {
  quantityProductsInCart: number
  totalPrice: number
  variant?: 'default' | 'compact'
}

export const CartStats = ({
  quantityProductsInCart,
  totalPrice,
  variant = 'default',
}: CartStatsProps) => {
  const isCompact = variant === 'compact'

  return (
    <div className="flex items-center gap-2">
      {/* Quantidade de Itens */}
      <Badge
        variant="secondary"
        className={cn(
          'h-7 pl-2 pr-2.5 flex items-center gap-1.5 transition-colors',
          isCompact ? 'text-xs' : 'text-sm',
          quantityProductsInCart > 0 && 'bg-primary/10 text-primary'
        )}
      >
        <ShoppingCart className={cn(isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
        <span className="font-medium tabular-nums">
          {quantityProductsInCart}
        </span>
      </Badge>

      <Separator orientation="vertical" className="h-7" />

      {/* Valor Total */}
      <Badge
        variant="outline"
        className={cn(
          'h-7 pl-2 pr-2.5 flex items-center gap-1.5 border-primary/20',
          isCompact ? 'text-xs' : 'text-sm'
        )}
      >
        <CircleDollarSign
          className={cn('text-primary', isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4')}
        />
        <span className="font-mono font-medium">{toReal(totalPrice)}</span>
      </Badge>
    </div>
  )
}
