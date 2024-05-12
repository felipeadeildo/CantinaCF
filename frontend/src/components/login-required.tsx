import { useAuth } from "@/contexts/auth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type LoginRequiredProps = {
  children: React.ReactNode
  allowed_roles?: number[]
}

export const LoginRequired = ({
  children,
  allowed_roles = [1, 2, 3, 4, 5],
}: LoginRequiredProps) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push(
        "/auth/login?authToastMsg=Você precisa estar logado para acessar esta página!"
      )
    } else if (!allowed_roles.includes(user.role_id)) {
      router.push("/?authToastMsg=Você não tem permissão para acessar esta página!")
    }
  }, [user, allowed_roles, router, isLoading])

  if (user && allowed_roles.includes(user.role_id)) {
    return children
  } else {
    return (
      <div className="flex justify-center items-center gap-2 text-xl mt-64">
        <Loader2 className="animate-spin" />
        Autenticando...
      </div>
    )
  }
}
