import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRoles } from "@/hooks/users"
import { TRole } from "@/types/user"
import { Button } from "../ui/button"

type Props = {
  checkedRoleIds: number[]
  onCheckRole: (role: TRole) => void
}

export const MultiSelectRoles = ({ onCheckRole, checkedRoleIds }: Props) => {
  const { data } = useRoles()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-xs w-full text-xs justify-start">
          Cargos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Selecione Cargos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data &&
          data.map((role) => (
            <DropdownMenuCheckboxItem
              key={role.id}
              checked={checkedRoleIds.includes(role.id)}
              onCheckedChange={() => onCheckRole(role)}
            >
              {role.name}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
