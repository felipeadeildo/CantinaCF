import { MultiSelectRoles } from "@/components/dropdown-menu/roles"
import { TReachargesQuery } from "@/types/queries"
import { TRole } from "@/types/user"
import { useCallback } from "react"

export const RolesFilter = ({
  query: [query, setQuery],
}: {
  query: TReachargesQuery
}) => {
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
    <MultiSelectRoles onCheckRole={toggleRole} checkedRoleIds={query.roleIds || []} />
  )
}
