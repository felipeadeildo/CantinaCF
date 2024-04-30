import { Button } from "@/components/ui/button"
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

import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useUserMutation } from "@/hooks/users"
import { SUser, userSchema } from "@/schemas/user"
import { UserRoles } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const CreateUserForm = () => {
  const form = useForm<SUser>({
    resolver: zodResolver(userSchema),
  })

  const { toast } = useToast()

  const { createUserMutation } = useUserMutation()

  const onSubmit = async (data: SUser) => {
    const res = await createUserMutation.mutateAsync(data)
    toast({
      title: "Mensagem",
      description: res.message,
      variant: "default",
    })
  }

  return (
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={form.formState.isSubmitting}
                />
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
            Criar Usuário
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CreateUserForm
