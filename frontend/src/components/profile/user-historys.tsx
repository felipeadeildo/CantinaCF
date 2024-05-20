import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TBRechargesQuery, TBSalesQuery } from "@/types/queries"
import { TUser } from "@/types/user"
import { useState } from "react"
import { IntervalFilter } from "../audits/recharges/filters/interval"
import { RechargesCards } from "./recharge-cards"
import { ProductSalesCards } from "./sales-cards"

type Props = {
  user: TUser
}

export const UserHistorys = ({ user }: Props) => {
  const rechargesQuery = useState<TBRechargesQuery>({
    userId: user.id,
  })

  const salesQuery = useState<TBSalesQuery>({ soldToUserId: user.id })

  return (
    <div className="flex justify-center pt-2 border-t-2 border-t-primary mb-14">
      <Tabs defaultValue="purchases">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="purchases" className="flex flex-col items-center">
          <IntervalFilter query={salesQuery} />
          <ProductSalesCards query={salesQuery} />
        </TabsContent>
        <TabsContent value="payments" className="flex flex-col items-center">
          <IntervalFilter query={rechargesQuery} />
          <RechargesCards query={rechargesQuery} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
