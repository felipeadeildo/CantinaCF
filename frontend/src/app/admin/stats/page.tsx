"use client"

import { AffiliatedHistory } from "@/components/admin/stats/affiliated-history"
import { PaymentMethodPies } from "@/components/admin/stats/graphs/payment-method-pies"
import { TopSellingProducts } from "@/components/admin/stats/graphs/top-selling-products-bar-chart"
import { QueryGeneratorModal } from "@/components/admin/stats/query-generator-modal"
import { LoginRequired } from "@/components/login-required"
import { UserCard } from "@/components/profile/user-card"
import { useStats } from "@/hooks/stats"
import { TBStatsQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useState } from "react"

const Stats = () => {
  const [query, setQuery] = useState<TBStatsQuery>({})
  const [user, setUser] = useState<TUser | undefined>()

  const { data, isLoading, isError, error } = useStats(query)

  return (
    <div className="divide-y-2 space-y-3 divide-primary">
      {user && <UserCard user={user} />}

      {isError && (
        <div className="p-3 text-center text-lg font-bold text-red-500">
          {error.message}
        </div>
      )}

      <TopSellingProducts isLoading={isLoading} data={data?.productQuantity} />

      <PaymentMethodPies isLoading={isLoading} data={data} />

      {query.userId && <AffiliatedHistory query={[query, setQuery]} />}

      <QueryGeneratorModal query={[query, setQuery]} user={user} setUser={setUser} />
    </div>
  )
}

const ProtectedStats = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <Stats />
    </LoginRequired>
  )
}

export default ProtectedStats
