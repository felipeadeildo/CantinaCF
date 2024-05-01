import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth"
import { useUserMutation } from "@/hooks/users"
import { isUserAdmin } from "@/lib/utils"
import { TUser, TUserUpdatePassword } from "@/types/user"
import { Loader } from "lucide-react"
import { useState } from "react"
import { useToast } from "../ui/use-toast"

type Props = {
  user: TUser
}

export const EditUserPasswordForm = ({ user }: Props) => {
  const { user: currentUser } = useAuth()
  const requireOldPassword = currentUser?.id !== user.id || !isUserAdmin(currentUser)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState<TUserUpdatePassword>({
    id: user.id,
    newPassword: "",
  })

  const { toast } = useToast()
  const { updateUserPasswordMutation } = useUserMutation()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const { message } = await updateUserPasswordMutation.mutateAsync(form)
    toast({
      title: "Mensagem",
      description: message,
      variant: "default",
    })
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senha</CardTitle>
        <CardDescription>
          Mudar a senha de {user.name} utilizada para acessar o perfil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {requireOldPassword && (
          <div className="space-y-1">
            <Label htmlFor="current">Senha Atual</Label>
            <Input
              id="current"
              type="password"
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="new">Nova Senha</Label>
          <Input
            id="new"
            type="password"
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : "Salvar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
