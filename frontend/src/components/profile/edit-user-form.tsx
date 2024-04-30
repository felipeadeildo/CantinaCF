import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUserMutation } from "@/hooks/users"
import { SUserWithoutPassword, userWithoutPasswordSchema } from "@/schemas/user"
import { TUser, UserRoles } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "../ui/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  user: TUser
}

export const EditUserForm = ({ user }: Props) => {
  const form = useForm<SUserWithoutPassword>({
    resolver: zodResolver(userWithoutPasswordSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      role_id: user.role_id.toString() as "1" | "2" | "3" | "4",
      matricula: user.matricula.toString(),
      serie: user.serie,
      turm: user.turm,
    },
  })

  const { toast } = useToast()

  const { updateUserMutation } = useUserMutation()

  const onSubmit = async (data: SUserWithoutPassword) => {
    const res = await updateUserMutation.mutateAsync(data)
    toast({
      title: "Mensagem",
      description: res.message,
      variant: "default",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta</CardTitle>
        <CardDescription>
          Fazer alterações nas informaçãoes da conta de {user.name}. Clique em salvar
          quando estiver tudo ok.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um Cargo" defaultValue="1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(UserRoles).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("role_id") === UserRoles["Aluno"] && (
              <>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="serie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Série</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={form.formState.isSubmitting} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="turm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turma</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={form.formState.isSubmitting} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={form.formState.isSubmitting} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
