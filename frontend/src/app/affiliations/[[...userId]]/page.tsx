"use client"

import { AddAffiliateModal } from "@/components/affiliations/add-affiliate-modal"
import { IntervalFilter } from "@/components/audits/recharges/filters/interval"
import { RechargesTable } from "@/components/audits/recharges/table"
import { LoginRequired } from "@/components/login-required"
import { SimpleTooltip } from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth"
import { useAffiliates, useAffiliatesMutation } from "@/hooks/affiliates"
import { useUser } from "@/hooks/users"
import { cn } from "@/lib/utils"
import { TBRechargesQuery } from "@/types/queries"
import { Eye, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Props = { params: { userId?: string[] } }

const Affiliation = ({ params }: Props) => {
  const { user } = useAuth()
  const [query, setQuery] = useState<{ userId: number; current: boolean }>({
    userId: (params.userId && parseInt(params.userId[0])) || 0,
    current: true,
  })
  const { data: users = [], isLoading } = useAffiliates(query)

  const { data: { user: affiliator } = {} } = useUser(query.userId.toString())

  const { removeAffiliateMutation } = useAffiliatesMutation()

  const [historyQuery, setHistoryQuery] = useState<TBRechargesQuery>({
    payrollReceiverId: query.userId,
    isPayrollHistory: true,
  })

  useEffect(() => {
    if (user && !params.userId) {
      setQuery({ userId: user.id, current: true })
    }
  }, [user, params.userId])

  return (
    <div className="container mx-auto mt-2">
      <h1 className="text-xl text-center mb-4">
        Gerenciamento de Afiliados de {affiliator?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-r-2">
          <h3 className="flex gap-2 items-center justify-center font-bold text-center mb-2">
            Afiliados
            <AddAffiliateModal forUser={affiliator} />
          </h3>
          {isLoading && (
            <div className="flex justify-center items-center mt-32">
              <Loader2 className="animate-spin" />
              <span className="text-xl ml-2">Carregando...</span>
            </div>
          )}

          <div className="h-[75dvh] overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex justify-between items-center p-2 my-2 border rounded-md mr-2",
                  user.id === historyQuery.userId && "bg-card"
                )}
              >
                <div className="flex gap-1 items-center">
                  <Button variant="link" asChild>
                    <Link href={`/profile/${user.id}`}>{user.name}</Link>
                  </Button>

                  <SimpleTooltip message={`Remover ${user.name} dos afiliados.`}>
                    <Trash2
                      className="size-5 text-red-500 cursor-pointer hover:text-red-800 transition-colors duration-300 ease-out"
                      onClick={() =>
                        affiliator &&
                        removeAffiliateMutation.mutate({ user, fromUser: affiliator })
                      }
                    />
                  </SimpleTooltip>
                </div>

                <SimpleTooltip message={`Ver Histórico de Recargas de ${user.name}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    asChild
                    onClick={() =>
                      setHistoryQuery((prev) => ({ ...prev, userId: user.id }))
                    }
                  >
                    <Eye className="h-6 w-6" />
                  </Button>
                </SimpleTooltip>
              </div>
            ))}
          </div>
        </div>

        <div className="ml-2 flex flex-col gap-2 justify-center items-center">
          <IntervalFilter query={[historyQuery, setHistoryQuery]} />
          <div className="h-[75dvh] overflow-y-auto">
            <RechargesTable query={[historyQuery, setHistoryQuery]} isPayrollHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

const ProtectedAffiliation = ({ params }: Props) => {
  return (
    <LoginRequired allowed_roles={[1, 2, 4]}>
      <Affiliation params={params} />
    </LoginRequired>
  )
}

export default ProtectedAffiliation
