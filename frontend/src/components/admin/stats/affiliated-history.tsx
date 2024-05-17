import { RechargesTable } from "@/components/audits/recharges/table"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAffiliates } from "@/hooks/affiliates"
import { cn } from "@/lib/utils"
import { TBRechargesQuery, TStatsQuery } from "@/types/queries"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

type Props = {
  query: TStatsQuery
}

export const AffiliatedHistory = ({ query: [query, setQuery] }: Props) => {
  const { data: users = [] } = useAffiliates(query)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<number>(0)

  const historyQuery = useState<TBRechargesQuery>({
    userId: value,
    payrollReceiverId: query.userId,
    to: query.to,
    from: query.from,
  })

  return (
    <div className="container mx-auto flex flex-col items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? users.find((framework) => framework.id === value)?.name
              : "Selecionar Afiliado"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Pesquisar pelo afiliado..." />
            <CommandEmpty>Nenhum Afiliado Encontrado</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    setValue(user.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <RechargesTable query={historyQuery} isPayrollHistory />
    </div>
  )
}
