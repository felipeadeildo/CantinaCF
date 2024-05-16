import { Button } from "@/components/ui/button"
import { SlidersHorizontal, User2 } from "lucide-react"

import { IntervalFilter } from "@/components/audits/recharges/filters/interval"
import { ComboboxUsers } from "@/components/combobox/users"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TStatsQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useCallback } from "react"

export const QueryGeneratorModal = ({
  query: [query, setQuery],
  user,
  setUser,
}: {
  query: TStatsQuery
  user?: TUser
  setUser: (user?: TUser) => void
}) => {
  const onUserSelected = useCallback(
    (user?: TUser) => {
      if (!user || user.id === query.userId) {
        setQuery((prev) => ({ ...prev, userId: undefined }))
        setUser(undefined)
      } else {
        setQuery((prev) => ({ ...prev, userId: user.id }))
        setUser(user)
      }
    },
    [query, setQuery, setUser]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="fixed bottom-4 right-4 flex items-center gap-0.5">
          <SlidersHorizontal />
          Aplicar Filtros
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros do Gráfico</DialogTitle>
          <DialogDescription>
            Permite filtrar por usuário e por intervalo de data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 items-center justify-center">
          <ComboboxUsers onUserSelected={onUserSelected} defaultUser={user} />
          <IntervalFilter query={[query, setQuery]} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
