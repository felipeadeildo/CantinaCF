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
import { useUsers } from "@/hooks/users"
import { cn } from "@/lib/utils"
import { TUser } from "@/types/user"
import { Check, ChevronsUpDown } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type ComboboxUsersProps = {
  onUserSelected: (user?: TUser) => void
  label?: string
}

export const ComboboxUsers = ({ onUserSelected, label }: ComboboxUsersProps) => {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<TUser | undefined>()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  const selectUser = useCallback(
    (user: TUser) => {
      if (user.id === selectedUser?.id) {
        setSelectedUser(undefined)
        onUserSelected(undefined)
      } else {
        setSelectedUser(user)
        setOpen(false)
        onUserSelected(user)
      }
    },
    [onUserSelected, selectedUser]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useUsers(debouncedQuery)
  const hasResult = data && data.pages.length > 0 && data.pages[0].users.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="max-w-xs w-full justify-between"
        >
          <span className="text-xs">
            {selectedUser ? selectedUser.name : label || "Selecionar Usuário"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false} className="max-w-xs w-full">
          <CommandInput
            placeholder="Pesquisar usuário..."
            value={query}
            onValueChange={setQuery}
          />

          <CommandList>
            {isLoading && <CommandEmpty>Carregando...</CommandEmpty>}
            {!hasResult && <CommandEmpty>Nenhum Usuário Encontrado</CommandEmpty>}
            <CommandGroup>
              {hasResult &&
                data.pages[0].users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={() => selectUser(user)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        user.name === selectedUser?.name
                          ? "opacity-100 text-primary"
                          : "opacity-0"
                      )}
                    />
                    <span className="truncate text-sm">{user.name}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
