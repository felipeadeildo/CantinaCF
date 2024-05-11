import { ComboboxUsers } from "@/components/combobox/users"
import { TReachargesQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useCallback } from "react"

export const RechargesFilters = ({
  query: [query, setQuery],
}: {
  query: TReachargesQuery
}) => {
  const selectUserId = useCallback(
    (user: TUser) => {
      setQuery({ ...query, userId: user.id })
    },
    [query, setQuery]
  )

  return (
    <div className="container mx-auto">
      <ComboboxUsers onUserSelected={selectUserId} />
    </div>
  )
}
