import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { TCart } from '@/types/cart'
import {
  Check,
  CreditCard,
  ScrollText,
  ShoppingBag,
  ShoppingBasket,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { BuyForm } from './buy-form'
import { CartItemCard } from './cart-item-card'
import { CartStats } from './cart-stats'

type Props = {
  cart: TCart[]
  quantityProductsInCart: number
  totalPrice: number
  className?: string
}

export const PurchaseConfirmation = ({
  cart,
  quantityProductsInCart,
  totalPrice,
  className,
}: Props) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasCart = cart.some((c) => c.quantity > 0)
    if (!hasCart) return setOpen(false)

    const timer = setTimeout(
      () => setOpen(cart.some((c) => c.quantity > 0)),
      60000
    )

    return () => clearTimeout(timer)
  }, [cart])

  const activeCartItems = cart.filter((item) => item.quantity > 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={cn(
            'gap-2 font-medium',
            'h-9 px-4 sm:h-10 sm:px-6',
            'transition-all duration-200',
            className
          )}
          variant={quantityProductsInCart === 0 ? 'ghost' : 'default'}
          disabled={quantityProductsInCart === 0}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="whitespace-nowrap">Confirmar Compra</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] gap-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            Confirmação de Compra
          </DialogTitle>
        </DialogHeader>

        {/* Conteúdo Responsivo */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Resumo do Pedido e Itens no Carrinho */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Resumo do Pedido */}
            <Card className="flex-1 bg-muted/50 border-none">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Resumo do Pedido</span>
                </div>
                <CartStats
                  quantityProductsInCart={quantityProductsInCart}
                  totalPrice={totalPrice}
                  variant="compact"
                />
              </CardContent>
            </Card>

            {/* Itens no Carrinho */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <ScrollText className="h-4 w-4 text-primary" />
                  <span>Itens no Carrinho</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activeCartItems.length}{' '}
                  {activeCartItems.length === 1 ? 'item' : 'itens'}
                </Badge>
              </div>
              <ScrollArea className="h-[180px] rounded-md">
                <div className="space-y-2 pr-4">
                  {activeCartItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Separator />

          {/* Formulário de Compra */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>Confirmar Credenciais</span>
            </div>
            <BuyForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
