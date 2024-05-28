import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useProducts } from "@/hooks/products"
import { cn } from "@/lib/utils"
import { TProduct } from "@/types/products"
import { Check, ChevronsUpDown } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type ComboboxProductsProps = {
  onProductSelected: (product?: TProduct) => void
  label?: string
  btnClassName?: string
  labelClassName?: string
  defaultProduct?: TProduct
}

export const ComboboxProducts = ({
  onProductSelected,
  label,
  btnClassName,
  labelClassName,
  defaultProduct,
}: ComboboxProductsProps) => {
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<TProduct | undefined>(
    defaultProduct
  )
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  const selectProduct = useCallback(
    (product: TProduct) => {
      if (product.id === selectedProduct?.id) {
        setSelectedProduct(undefined)
        onProductSelected(undefined)
      } else {
        setSelectedProduct(product)
        setOpen(false)
        onProductSelected(product)
      }
    },
    [onProductSelected, selectedProduct]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useProducts(debouncedQuery)

  const hasResult = data && data.products && data.products.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn("max-w-xs w-full justify-between", btnClassName)}
        >
          <span className={cn("text-xs", labelClassName)}>
            {selectedProduct ? selectedProduct.name : label || "Selecionar Produto"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false} className="max-w-xs w-full">
          <CommandInput
            placeholder="Pesquisar produto..."
            value={query}
            onValueChange={setQuery}
          />

          <CommandList>
            {isLoading && <CommandEmpty>Carregando...</CommandEmpty>}
            {!hasResult && <CommandEmpty>Nenhum Produto Encontrado</CommandEmpty>}
            <CommandGroup>
              {data &&
                data.products &&
                data.products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => selectProduct(product)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        product.name === selectedProduct?.name
                          ? "opacity-100 text-primary"
                          : "opacity-0"
                      )}
                    />
                    <span className={cn("truncate text-sm", labelClassName)}>
                      {product.name}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
