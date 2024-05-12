import { ComboboxUsers } from "@/components/combobox/users"
import { MultiSelectPaymentMethods } from "@/components/dropdown-menu/payment-methods"
import { MultiSelectRoles } from "@/components/dropdown-menu/roles"
import { Checkbox } from "@/components/ui/checkbox"
import { TReachargesQuery } from "@/types/queries"
import { TPaymentMethod } from "@/types/recharge"
import { TRole, TUser } from "@/types/user"
import { useCallback } from "react"

import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

export const RechargesFilters = ({
  query: [query, setQuery],
}: {
  query: TReachargesQuery
}) => {
  const selectUserId = useCallback(
    (user?: TUser) => {
      setQuery({ ...query, userId: user ? user.id : undefined })
    },
    [query, setQuery]
  )

  const selectAllowedByUserId = useCallback(
    (user?: TUser) => {
      setQuery({ ...query, allowedByUserId: user ? user.id : undefined })
    },
    [query, setQuery]
  )

  const togglePaymentMethod = useCallback(
    (paymentMethod: TPaymentMethod) => {
      setQuery({
        ...query,
        paymentMethodIds: query.paymentMethodIds?.includes(paymentMethod.id)
          ? query.paymentMethodIds?.filter((id) => id !== paymentMethod.id)
          : query.paymentMethodIds
          ? [...query.paymentMethodIds, paymentMethod.id]
          : [paymentMethod.id],
      })
    },
    [query, setQuery]
  )

  const toggleRole = useCallback(
    (role: TRole) => {
      setQuery({
        ...query,
        roleIds: query.roleIds?.includes(role.id)
          ? query.roleIds?.filter((id) => id !== role.id)
          : query.roleIds
          ? [...query.roleIds, role.id]
          : [role.id],
      })
    },
    [query, setQuery]
  )

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-2 gap-2">
      <ComboboxUsers onUserSelected={selectUserId} label="Selecionar quem pagou" />
      <ComboboxUsers
        onUserSelected={selectAllowedByUserId}
        label="Selecionar quem liberou"
      />

      <MultiSelectPaymentMethods
        onCheckPaymentMethod={togglePaymentMethod}
        checkedPaymentMethodIds={query.paymentMethodIds || []}
      />

      <MultiSelectRoles onCheckRole={toggleRole} checkedRoleIds={query.roleIds || []} />

      <Select onValueChange={(value) => setQuery({ ...query, status: value })}>
        <SelectTrigger className="max-w-xs w-full h-9 rounded-md px-3 text-xs">
          <SelectValue placeholder="Selecionar Status do Pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="to allow">Aguardando Liberação</SelectItem>
            <SelectItem value="accepted">Aceito</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "max-w-xs w-full h-9 rounded-md px-3 text-xs justify-start text-left font-normal",
                !query && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {query.from ? (
                query.to ? (
                  <>
                    {format(query.from, "LLL dd, y")} - {format(query.to, "LLL dd, y")}
                  </>
                ) : (
                  format(query.from, "LLL dd, y")
                )
              ) : (
                <span>Selecionar Intervalo de Data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={query?.from}
              selected={{ from: query?.from, to: query?.to }}
              onSelect={(dateRange) =>
                setQuery({ ...query, from: dateRange?.from, to: dateRange?.to })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-0.5 justify-center pl-2 col-start-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={query.onlyIsPayroll}
            onCheckedChange={() => {
              setQuery({ ...query, onlyIsPayroll: !query.onlyIsPayroll })
            }}
          />
          <label htmlFor="only_balance">
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Somente Folha de Pagamento
            </span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={query.onlyIsPayPayroll}
            onCheckedChange={() => {
              setQuery({ ...query, onlyIsPayPayroll: !query.onlyIsPayPayroll })
            }}
          />
          <label htmlFor="only_balance">
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Somente Pagamento da Folha de Pagamento
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
