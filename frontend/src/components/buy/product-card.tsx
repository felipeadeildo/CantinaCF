import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { useProductsMutation } from '@/hooks/products'
import { cn, toReal } from '@/lib/utils'
import { TCart } from '@/types/cart'
import { TProduct } from '@/types/products'
import { AlertCircle, Minus, Package2, Plus } from 'lucide-react'

type ProductCardProps = {
  product: TProduct
  cart: TCart | null
  variant?: 'default' | 'compact'
}

export const ProductCard = ({
  product,
  cart,
  variant = 'default',
}: ProductCardProps) => {
  const { addProductToCartMutation, removeProductFromCartMutation } =
    useProductsMutation()
  const { toast } = useToast()

  const handleClick = async (action: 'add' | 'remove') => {
    const callback =
      action === 'add'
        ? addProductToCartMutation
        : removeProductFromCartMutation

    try {
      const { message } = await callback.mutateAsync(product.id)
      toast({ description: message })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar carrinho',
      })
    }
  }

  const cartQuantity = cart ? cart.quantity : 0
  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity <= 5 && !isOutOfStock

  const buttonSize = variant === 'compact' ? 'icon-sm' : 'icon'
  const iconSize = variant === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <Card
      className={cn(
        'group transition-all duration-200',
        'hover:shadow-md hover:border-primary/20',
        cartQuantity > 0 && 'border-primary/30 bg-primary/5'
      )}
    >
      <CardHeader
        className={cn('space-y-0', variant === 'compact' ? 'p-3' : 'pb-3')}
      >
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={cn(
              'line-clamp-1 font-medium',
              variant === 'compact' ? 'text-sm' : 'text-base'
            )}
          >
            <span className="flex items-center gap-2">
              <Package2
                className={cn('flex-shrink-0 text-muted-foreground', iconSize)}
              />
              {product.name}
            </span>
          </CardTitle>

          {(isOutOfStock || isLowStock) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={isOutOfStock ? 'destructive' : 'warning'}
                    className={cn(
                      'text-xs',
                      variant === 'compact' && 'px-1.5 py-0.5'
                    )}
                  >
                    <AlertCircle
                      className={cn(
                        'mr-1',
                        variant === 'compact' ? 'h-3 w-3' : 'h-3.5 w-3.5'
                      )}
                    />
                    {isOutOfStock ? 'Sem estoque' : 'Acabando'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {isOutOfStock
                    ? 'Produto indisponível no momento'
                    : `Apenas ${product.quantity} unidades disponíveis`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <p
          className={cn(
            'font-mono font-medium',
            variant === 'compact' ? 'text-sm' : 'text-base',
            'text-muted-foreground mt-1'
          )}
        >
          {toReal(product.value)}
        </p>
      </CardHeader>

      <CardContent
        className={cn(
          'flex items-center justify-between',
          variant === 'compact' ? 'p-3 pt-0' : 'pb-4'
        )}
      >
        <Badge
          variant="secondary"
          className={cn(
            'transition-colors',
            cartQuantity > 0 &&
              'bg-primary/10 hover:bg-primary/20 text-primary',
            variant === 'compact' && 'px-1.5 py-0.5 text-xs'
          )}
        >
          {cartQuantity} no carrinho
        </Badge>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size={buttonSize}
            disabled={
              cartQuantity === 0 || removeProductFromCartMutation.isPending
            }
            onClick={() => handleClick('remove')}
            className={cn(
              'transition-colors',
              cartQuantity > 0 && 'border-primary/30 hover:border-primary/50'
            )}
          >
            <Minus className={iconSize} />
          </Button>

          <Button
            variant="outline"
            size={buttonSize}
            disabled={isOutOfStock || addProductToCartMutation.isPending}
            onClick={() => handleClick('add')}
            className={cn(
              'transition-colors',
              cartQuantity > 0 && 'border-primary/30 hover:border-primary/50'
            )}
          >
            <Plus className={iconSize} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
