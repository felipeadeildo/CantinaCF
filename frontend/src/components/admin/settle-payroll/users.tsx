import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePayrollMutation } from "@/hooks/payroll"
import { useUsers } from "@/hooks/users"
import { maskMoney, sanitizeFMoney } from "@/lib/masks"
import { cn } from "@/lib/utils"
import { TUser } from "@/types/user"
import {
  ArrowDownCircle,
  Check,
  DollarSign,
  Equal,
  Loader2,
  Minus,
  ScanEye,
} from "lucide-react"
import { useState } from "react"

type Props = {
  setUser: (user: TUser) => void
  selectedUser: TUser | null
}

export const Users = ({ selectedUser, setUser }: Props) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useUsers(
    "",
    false,
    true
  )
  const [settleUserId, setSettleUserId] = useState<number>(0)
  const [fsettledValue, setFsettledValue] = useState<string>("")
  const {
    settlementMutation: { mutate, isPending },
  } = usePayrollMutation()

  const isEditingUser = (user: TUser) => settleUserId === user.id

  const settledValue = () => parseFloat(sanitizeFMoney(fsettledValue))

  const newValue = (user: TUser) => user.balance_payroll - settledValue()

  const settleUser = (user: TUser) => {
    mutate({
      userId: user.id,
      value: settledValue(),
    })

    setSettleUserId(0)
  }

  return (
    <div className="border-r-2 mr-2 border-r-primary overflow-y-auto h-[90vh]">
      {isLoading && <div className="text-center mt-32 text-xl">Carregando...</div>}
      {data?.pages &&
        data.pages.map((page) =>
          page.users.map((user) => (
            <div
              key={user.id}
              className={cn(
                "mx-2 border my-1 rounded-md p-2",
                selectedUser?.id == user.id && "bg-primary/25"
              )}
            >
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
                      <span className="text-green-500">{fsettledValue}</span>
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
                          setFsettledValue(e.target.value)
                        }}
                        className="text-right"
                        disabled={isPending}
                        autoFocus
                      />
                      <Button
                        size="icon"
                        disabled={newValue(user) < 0 || isPending}
                        onClick={() => settleUser(user)}
                      >
                        <Check size={18} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        setFsettledValue(maskMoney(user.balance_payroll))
                        setSettleUserId(user.id)
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

      <div className="flex justify-center my-3">
        <Button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
          <div className="flex gap-2 items-center justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ArrowDownCircle />
            )}
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </div>
        </Button>
      </div>
    </div>
  )
}
