import { ComboboxUsers } from "@/components/combobox/users"
import { TRechargesQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useCallback } from "react"

export const UserIdFilter = ({
  query: [query, setQuery],
}: {
  query: TRechargesQuery
}) => {
  const selectUserId = useCallback(
    (user?: TUser) => {
      setQuery({ ...query, userId: user ? user.id : undefined })
    },
    [query, setQuery]
  )

  return <ComboboxUsers onUserSelected={selectUserId} label="Selecionar quem pagou" />
}
