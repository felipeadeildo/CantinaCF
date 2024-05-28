import { ComboboxUsers } from "@/components/combobox/users"
import { TRechargesQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useCallback } from "react"

export const AllowedByUserIdFilter = ({
  query: [query, setQuery],
}: {
  query: TRechargesQuery
}) => {
  const selectAllowedByUserId = useCallback(
    (user?: TUser) => {
      setQuery({ ...query, allowedByUserId: user ? user.id : undefined })
    },
    [query, setQuery]
  )

  return (
    <ComboboxUsers
      onUserSelected={selectAllowedByUserId}
      label="Selecionar quem liberou"
    />
  )
}
