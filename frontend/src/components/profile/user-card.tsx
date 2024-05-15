import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/auth"
import { isUserAdmin } from "@/lib/utils"
import { TUser } from "@/types/user"
import { EditUserDialog } from "./edit-user-dialog"
import { UserInfos } from "./user-infos"

type Props = {
  user: TUser
}

export const UserCard = ({ user }: Props) => {
  const { user: currentUser } = useAuth()
  return (
    <Card>
      <CardHeader className="py-1 px-0.5">
        <CardTitle className="flex justify-center gap-1 items-center text-lg">
          <span>{user.name}</span>
          {currentUser && (isUserAdmin(currentUser) || currentUser.id === user.id) && (
            <EditUserDialog user={user} />
          )}
        </CardTitle>
        <CardDescription className="text-center">
          Matrícula: {user.matricula || "-"} | Username: {user.username} | ID: {user.id}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-1">
        <UserInfos user={user} />
      </CardContent>
    </Card>
  )
}
