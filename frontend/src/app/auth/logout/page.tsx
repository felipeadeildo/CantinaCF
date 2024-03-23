"use client"

import { useAuth } from "@/contexts/auth"
import { LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Logout = () => {
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    auth.logout()
    router.push("/auth/login")
  }, [auth, router])
  return <LoaderCircleIcon className="animate-spin" />
}

export default Logout
