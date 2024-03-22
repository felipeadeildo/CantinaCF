"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginFormInputs, loginSchema } from "@/schemas/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth"
import { LoaderCircle, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Login = () => {
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (auth.user) {
      router.push("/")
    }
  }, [auth, router])

  const onSubmit = async (data: LoginFormInputs) => {
    const { ok, error } = await auth.login(data.username, data.password)
    if (ok) {
      router.push("/")
    } else {
      toast({
        title: "Falha no Login",
        description: error,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto max-h-lg my-36">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Login
