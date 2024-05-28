"use client"

import { Stats } from "@/components/admin/stats/stats"
import { LoginRequired } from "@/components/login-required"
import { UserHistorys } from "@/components/profile/user-historys"
import { UserNotFound } from "@/components/profile/user-not-found"
import { useAuth } from "@/contexts/auth"
import { useUser } from "@/hooks/users"
import { Loader } from "lucide-react"
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

  if (!userData) return <UserNotFound />

  return (
    <>
      <Stats targetUser={userData} isProfile />
      <UserHistorys user={userData} />
    </>
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
