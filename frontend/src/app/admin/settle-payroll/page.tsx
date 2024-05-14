"use client"

import { PayrollHistory } from "@/components/admin/settle-payroll/payroll-history"
import { Users } from "@/components/admin/settle-payroll/users"
import { LoginRequired } from "@/components/login-required"
import { TUser } from "@/types/user"
import { useState } from "react"

const SettlePayroll = () => {
  const [user, setUser] = useState<TUser | null>(null)

  return (
    <>
      <h1 className="text-xl text-center">Liquidar Saldo Devedor</h1>
      <div className="grid grid-cols-2 justify-center gap-1">
        <Users setUser={setUser} selectedUser={user} />
        <PayrollHistory user={user} />
      </div>
    </>
  )
}

const ProtectedSettlePayroll = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <SettlePayroll />
    </LoginRequired>
  )
}

export default ProtectedSettlePayroll
