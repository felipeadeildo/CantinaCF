import { RechargesTable } from "@/components/audits/recharges/table"
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
import { useAffiliates } from "@/hooks/affiliates"
import { cn } from "@/lib/utils"
import { TBRechargesQuery, TStatsQuery } from "@/types/queries"
import { Check, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  query: TStatsQuery
}

export const AffiliatedHistory = ({ query: [query, setQuery] }: Props) => {
  const { data: users = [] } = useAffiliates(query)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<number>(0)

  const [historyQuery, setHistoryQuery] = useState<TBRechargesQuery>({
    userId: value,
    payrollReceiverId: query.userId,
    to: query.to,
    from: query.from,
  })

  useEffect(() => {
    setHistoryQuery((prev) => ({
      ...prev,
      payrollReceiverId: query.userId,
      to: query.to,
      from: query.from,
    }))
  }, [query])

  useEffect(() => {
    setHistoryQuery((prev) => ({ ...prev, userId: value }))
  }, [value])

  if (!users.length) return null

  return (
    <div className="container mx-auto flex flex-col items-center gap-2 pt-2">
      <h1 className="text-xl">Histórico de Recarga dos Afiliados</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between text-wrap text-xs"
          >
            {value
              ? users.find((user) => user.id === value)?.name
              : "Selecionar Afiliado"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command className="max-w-xs w-full">
            <CommandInput placeholder="Pesquisar pelo afiliado..." />
            <CommandEmpty>Nenhum Afiliado Encontrado</CommandEmpty>
            <CommandList>
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {historyQuery.userId != 0 && (
        <div className="w-full max-w-3xl h-[70vh] overflow-y-auto">
          <RechargesTable query={[historyQuery, setHistoryQuery]} isPayrollHistory />
        </div>
      )}
    </div>
  )
}
