import { useAuth } from "@/contexts/auth"
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
      return router.push("/auth/login")
    }

    if (!allowed_roles.includes(user.role_id)) {
      router.push("/auth/login")
    }
  }, [user, allowed_roles, router, isLoading])

  if (user && allowed_roles.includes(user.role_id)) {
    return children
  } else {
    return <div className="text-center text-xl mt-64">Autenticando...</div>
  }
}
