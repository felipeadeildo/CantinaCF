"use client"

import { LoginRequired } from "@/components/login-required"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Home = () => {
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!auth.user) {
      router.push("/auth/login")
    }
  }, [auth, router])
  return <>Hello World</>
}

export const ProtectedHome = () => {
  return (
    <LoginRequired>
      <Home />
    </LoginRequired>
  )
}

export default ProtectedHome
