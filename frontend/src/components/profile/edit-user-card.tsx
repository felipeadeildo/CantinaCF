import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TUser } from "@/types/user"
import { EditUserForm } from "./edit-user-form"
import { EditUserPasswordForm } from "./edit-user-password-form"

type Props = {
  user: TUser
}

export const EditUserCard = ({ user }: Props) => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <EditUserForm user={user} />
      </TabsContent>
      <TabsContent value="password">
        <EditUserPasswordForm user={user} />
      </TabsContent>
    </Tabs>
  )
}
