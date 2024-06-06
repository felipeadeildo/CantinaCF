"use client"

import { LoginRequired } from "@/components/login-required"
import { RechargeForm } from "@/components/recharge/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Recharge = () => {
  return (
    <div className="flex justify-center items-center h-[80dvh]">
      <Card>
        <CardHeader className="py-1">
          <CardTitle className="text-center">Recarregar Saldo</CardTitle>
          <CardDescription>
            Recarregue seu saldo na cantina para poder comprar lanches!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RechargeForm />
        </CardContent>
      </Card>
    </div>
  )
}

const ProtectedRecharge = () => {
  return (
    <LoginRequired>
      <Recharge />
    </LoginRequired>
  )
}

export default ProtectedRecharge
