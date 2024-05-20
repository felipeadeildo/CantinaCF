import { AffiliatedHistory } from "@/components/admin/stats/affiliated-history"
import { PaymentMethodPies } from "@/components/admin/stats/graphs/payment-method-pies"
import { TopSellingProducts } from "@/components/admin/stats/graphs/top-selling-products-bar-chart"
import { QueryGeneratorModal } from "@/components/admin/stats/query-generator-modal"
import { UserCard } from "@/components/profile/user-card"
import { useStats } from "@/hooks/stats"
import { TBStatsQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useState } from "react"

type Props = {
  targetUser?: TUser
  isProfile?: boolean
}

export const Stats = ({ targetUser, isProfile = false }: Props) => {
  const [query, setQuery] = useState<TBStatsQuery>({ userId: targetUser?.id })
  const [user, setUser] = useState<TUser | undefined>(targetUser)

  const { data, isLoading, isError, error } = useStats(query)

  return (
    <div className="divide-y-2 space-y-3 divide-primary mb-10">
      {user && <UserCard user={user} />}

      {isError && (
        <div className="p-3 text-center text-lg font-bold text-red-500">
          {error.message}
        </div>
      )}

      <TopSellingProducts isLoading={isLoading} data={data?.productQuantity} />

      <PaymentMethodPies isLoading={isLoading} data={data} />

      {query.userId && <AffiliatedHistory query={[query, setQuery]} />}

      <QueryGeneratorModal
        query={[query, setQuery]}
        user={user}
        setUser={setUser}
        isProfile={isProfile}
      />
    </div>
  )
}
