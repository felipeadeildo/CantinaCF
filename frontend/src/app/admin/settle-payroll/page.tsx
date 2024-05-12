"use client"

import { LoginRequired } from "@/components/login-required"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUsers } from "@/hooks/users"
import { maskMoney, sanitizeFMoney } from "@/lib/masks"
import { cn } from "@/lib/utils"
import { TUser } from "@/types/user"
import { Check, DollarSign, Equal, Minus, ScanEye } from "lucide-react"
import { useState } from "react"

const SettlePayroll = () => {
  const { data, isLoading } = useUsers("", false, true)
  const [user, setUser] = useState<TUser | null>(null)
  const [liquidUserId, setLiquidUserId] = useState<number>(0)
  const [liquidFormattedValue, setLiquidFormattedValue] = useState<string>("")

  const isEditingUser = (user: TUser) => liquidUserId === user.id

  const newValue = (user: TUser) =>
    user.balance_payroll - parseFloat(sanitizeFMoney(liquidFormattedValue))

  return (
    <div className="container mx-auto">
      <h1 className="text-xl text-center">Liquidar Saldo Devedor</h1>
      <div className="grid grid-cols-2">
        <div className="border-r-2 mr-2 border-r-primary">
          {isLoading && <div className="text-center mt-32 text-xl">Carregando...</div>}
          {data?.pages &&
            data.pages.map((page) =>
              page.users.map((user) => (
                <div key={user.id} className="mx-2 border my-1 rounded-md p-2">
                  <div className="ml-1 flex gap-0.5 justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span>
                        {user.name} ({user.id})
                      </span>
                      {isEditingUser(user) ? (
                        <div className="flex gap-0.5">
                          <span className="text-red-500">
                            {maskMoney(user.balance_payroll)}
                          </span>
                          <Minus />
                          <span className="text-green-500">{liquidFormattedValue}</span>
                          <Equal />
                          <span
                            className={cn(
                              "text-yellow-500",
                              newValue(user) < 0 && "text-red-700 underline"
                            )}
                          >
                            {maskMoney(newValue(user))}
                          </span>
                        </div>
                      ) : (
                        <span className="text-red-500">
                          {maskMoney(user.balance_payroll)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 items-end">
                      <Button onClick={() => setUser(user)} variant="outline" size="icon">
                        <ScanEye size={18} />
                      </Button>

                      {isEditingUser(user) ? (
                        <div className="flex gap-0.5">
                          <Input
                            defaultValue={maskMoney(user.balance_payroll)}
                            onChange={(e) => {
                              e.target.value = maskMoney(e.target.value)
                              setLiquidFormattedValue(e.target.value)
                            }}
                            className="text-right"
                            autoFocus
                          />
                          <Button size="icon" disabled={newValue(user) < 0}>
                            <Check size={18} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            setLiquidFormattedValue(maskMoney(user.balance_payroll))
                            setLiquidUserId(user.id)
                          }}
                        >
                          <DollarSign size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
        </div>

        <div>
          <h2 className="text-center text-lg">
            {user ? `Histórico de Pagamentos de ${user.name}` : "Histórico de Pagamentos"}
          </h2>


          {!user && (
            <div className="text-center mt-32">Nenhum Usuário Selecionado ainda.</div>
          )}
        </div>
      </div>
    </div>
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
