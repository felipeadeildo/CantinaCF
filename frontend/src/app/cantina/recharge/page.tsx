"use client"

import { LoginRequired } from "@/components/login-required"
import { RechargeForm } from "@/components/recharge/form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Recharge = () => {
  return (
    <div className="flex justify-center items-center h-[80dvh]">
      <Card>
        <CardHeader>
          <CardTitle>Recarregar Saldo</CardTitle>
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
