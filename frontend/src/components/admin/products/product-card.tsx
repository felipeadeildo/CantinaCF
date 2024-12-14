import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { maskMoney, sanitizeFMoney } from '@/lib/masks'
import { cn } from '@/lib/utils'
import { TProduct } from '@/types/products'
import {
  AlertCircle,
  DollarSign,
  Edit2,
  Package2,
  Save,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react'
import { memo, useState } from 'react'

type ProductCardProps = {
  product: TProduct
  onUpdate: (id: number, data: Partial<TProduct>) => void
  onDelete: (id: number) => void
}

export const ProductCard = memo(
  ({ product, onUpdate, onDelete }: ProductCardProps) => {
    const [editField, setEditField] = useState<
      'name' | 'value' | 'quantity' | null
    >(null)
    const [formData, setFormData] = useState({
      name: product.name,
      value: product.value,
      quantity: product.quantity,
    })

    const handleSubmit = (field: 'name' | 'value' | 'quantity') => {
      onUpdate(product.id, { [field]: formData[field] })
      setEditField(null)
    }

    const isLowStock = product.quantity <= 5
    const isOutOfStock = product.quantity === 0

    return (
      <Card className="group relative transition-all hover:shadow-lg border-muted">
        {/* Status Badge */}
        {(isLowStock || isOutOfStock) && (
          <div className="absolute -top-1.5 -right-1.5 z-10 sm:-top-2 sm:-right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={isOutOfStock ? 'destructive' : 'warning'}
                    className="shadow-sm text-[10px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5"
                  >
                    <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    <span className="hidden sm:inline">
                      {isOutOfStock ? 'Sem Estoque' : 'Estoque Baixo'}
                    </span>
                    <span className="sm:hidden">
                      {isOutOfStock ? 'Zerado' : 'Baixo'}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {isOutOfStock
                    ? 'Produto indisponível no momento'
                    : `Apenas ${product.quantity} unidades disponíveis`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <CardHeader className="space-y-3 p-3 sm:space-y-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            {/* Product Name Section */}
            <div className="flex-1">
              {editField === 'name' ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Input
                    className="h-8 text-sm sm:h-9 sm:text-base"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit('name')}
                    autoFocus
                    placeholder="Nome do produto"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleSubmit('name')}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => setEditField(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group/name relative">
                  <CardTitle className="text-sm sm:text-base font-medium sm:font-semibold flex items-center gap-1.5 sm:gap-2">
                    <Package2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    <span className="line-clamp-1">{product.name}</span>
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover/name:opacity-100 absolute -right-1 -top-1 h-7 w-7 sm:h-8 sm:w-8 transition-opacity"
                    onClick={() => setEditField('name')}
                  >
                    <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Excluir produto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Separator className="h-px" />
        </CardHeader>

        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* Price Section */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                Valor
              </div>
              {editField === 'value' ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Input
                    className="h-8 text-sm sm:h-9 sm:text-base"
                    value={maskMoney(formData.value)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        value: parseFloat(sanitizeFMoney(e.target.value)),
                      }))
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit('value')}
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleSubmit('value')}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => setEditField(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-8 sm:h-9 text-sm sm:text-base font-mono"
                  onClick={() => setEditField('value')}
                >
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  {maskMoney(product.value)}
                </Button>
              )}
            </div>

            {/* Quantity Section */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                Estoque
              </div>
              {editField === 'quantity' ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Input
                    className="h-8 text-sm sm:h-9 sm:text-base"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 0,
                      }))
                    }}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleSubmit('quantity')
                    }
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleSubmit('quantity')}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => setEditField(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start gap-2 h-8 sm:h-9 text-sm sm:text-base',
                    isOutOfStock && 'text-destructive border-destructive',
                    isLowStock && 'text-warning border-warning'
                  )}
                  onClick={() => setEditField('quantity')}
                >
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="tabular-nums">{product.quantity}</span>
                  <span className="hidden sm:inline">unidades</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

ProductCard.displayName = 'ProductCard'