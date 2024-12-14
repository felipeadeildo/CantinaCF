import { useAuth } from '@/contexts/auth'
import { usePurchaseMutation } from '@/hooks/purcharse'
import { LoginFormInputs, loginSchema } from '@/schemas/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, LogIn, ShieldAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ComboboxUsers } from '../combobox/users'
import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'

export const BuyForm = () => {
  const { user } = useAuth()

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: user?.username || '',
      password: '',
    },
  })

  const { toast } = useToast()
  const { mutateAsync, isPending, isError, error } = usePurchaseMutation()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const message = await mutateAsync(data)
      toast({
        description: message,
      })
    } catch (error) {
      // erro tratado pelo tanstack
    }
  }

  return (
    <Form {...form}>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2 justify-center">
            <ShieldAlert /> {error.message}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <ComboboxUsers
                  onUserSelected={(selectedUser) =>
                    field.onChange(selectedUser?.username)
                  }
                  btnClassName="px-3 w-full max-w-lg text-sm"
                  defaultUser={user || undefined}
                />
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
                  className="w-full max-w-lg text-sm"
                  disabled={form.formState.isSubmitting || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
          size="sm"
          className="w-full max-w-lg mt-3"
        >
          {form.formState.isSubmitting || isPending ? (
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
