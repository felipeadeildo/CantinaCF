"use client"

import { LoginRequired } from "@/components/login-required"
import { UserCard } from "@/components/profile/user-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth"
import { useUser } from "@/hooks/users"
import { Loader } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const Profile = () => {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const userId = searchParams.get("userId") || user?.id.toString() || ""
  const { data: { user: userData } = {}, isLoading, isError, error } = useUser(userId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 text-xl mt-64">
        <Loader className="animate-spin" />
        Carregando...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center text-center gap-2 text-xl mt-64">
        {error.message}
      </div>
    )
  }

  return userData ? (
    <UserCard user={userData} />
  ) : (
    <Alert variant="destructive" className="mt-64">
      <AlertDescription className="flex flex-col items-center gap-2 justify-center">
        Usuário não encontrado.
        <Button variant="link" asChild>
          <Link href={"/admin/users"}>Lista de Usuários</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

const ProtectedProfile = () => {
  return (
    <LoginRequired>
      <Profile />
    </LoginRequired>
  )
}

export default ProtectedProfile
