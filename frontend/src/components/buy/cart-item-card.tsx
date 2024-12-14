import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { useProductsMutation } from '@/hooks/products'
import { toReal } from '@/lib/utils'
import { TCart } from '@/types/cart'
import { Minus, Package2, Plus, X } from 'lucide-react'

type CartItemCardProps = {
  item: TCart
}

export const CartItemCard = ({ item }: CartItemCardProps) => {
  const { product, quantity } = item
  const subtotal = product.value * quantity

  const { addProductToCartMutation, removeProductFromCartMutation } =
    useProductsMutation()
  const { toast } = useToast()

  const handleQuantityChange = async (action: 'add' | 'remove') => {
    const mutation =
      action === 'add'
        ? addProductToCartMutation
        : removeProductFromCartMutation
    try {
      const { message } = await mutation.mutateAsync(product.id)
      toast({ description: message })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar quantidade',
      })
    }
  }

  return (
    <Card className="bg-card/50 hover:bg-muted/30 transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Produto e Quantidade */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Package2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{product.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm text-muted-foreground font-mono">
                {toReal(product.value)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 bg-muted/50 rounded-md px-2 py-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 hover:bg-background/50"
                        disabled={removeProductFromCartMutation.isPending}
                        onClick={() => handleQuantityChange('remove')}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-medium tabular-nums w-4 text-center">
                        {quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 hover:bg-background/50"
                        disabled={addProductToCartMutation.isPending}
                        onClick={() => handleQuantityChange('add')}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Ajustar quantidade
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Separador Vertical */}
          <Separator orientation="vertical" className="h-8" />

          {/* Subtotal */}
          <div className="text-right">
            <Badge
              variant="secondary"
              className="mb-1 font-mono text-[10px] px-1.5 py-0.5"
            >
              Subtotal
            </Badge>
            <p className="text-sm font-medium font-mono">{toReal(subtotal)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
