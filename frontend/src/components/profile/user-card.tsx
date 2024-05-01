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
      <CardHeader>
        <CardTitle className="text-center">{user.name}</CardTitle>
        <CardDescription className="text-center">
          Matrícula: {user.matricula || "-"} | Username: {user.username} | ID: {user.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <UserInfos user={user} />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {currentUser && (isUserAdmin(currentUser) || currentUser.id === user.id) && (
          <EditUserDialog user={user} />
        )}
      </CardFooter>
    </Card>
  )
}
