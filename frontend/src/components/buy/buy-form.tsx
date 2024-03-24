import { useAuth } from "@/contexts/auth"
import { LoginFormInputs, loginSchema } from "@/schemas/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, LogIn } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

export const BuyForm = () => {
  const { user } = useAuth()

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: user?.username || "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormInputs) => {
    // TODO: Implement purchase here :D
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
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

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          size="sm"
          className="w-full mt-3"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
              Confirmando Compra...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Comprar
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
