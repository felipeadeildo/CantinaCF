"use client"

import { Stats } from "@/components/admin/stats/stats"
import { LoginRequired } from "@/components/login-required"

const ProtectedStats = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <Stats />
    </LoginRequired>
  )
}

export default ProtectedStats
