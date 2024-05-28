import { IntervalFilter } from "@/components/audits/recharges/filters/interval"
import { RechargesTable } from "@/components/audits/recharges/table"
import { TBRechargesQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useEffect, useState } from "react"
type Props = {
  user: TUser | null
}

export const PayrollHistory = ({ user }: Props) => {
  const query = useState<TBRechargesQuery>({
    payrollReceiverId: user?.id,
    isPayrollHistory: true,
  })

  const setQuery = query[1]

  useEffect(() => {
    setQuery((prev) => ({ ...prev, payrollReceiverId: user?.id }))
  }, [user, setQuery])

  return (
    <div className="">
      <h2 className="text-center text-lg">
        {user ? (
          <span>
            Histórico do Saldo Devedor
            <div className="font-semibold">{user.name}</div>
          </span>
        ) : (
          "Histórico do Saldo Devedor"
        )}
      </h2>

      {!user && (
        <div className="text-center mt-32">
          Nada para mostrar uma vez que nenhum usuário foi selecionado ainda.
        </div>
      )}

      {user && (
        <div className="container mx-auto w-full flex justify-center">
          <IntervalFilter query={query} />
        </div>
      )}

      <div className="overflow-y-auto h-[80vh]">
        {user && <RechargesTable query={query} isPayrollHistory />}
      </div>
    </div>
  )
}
