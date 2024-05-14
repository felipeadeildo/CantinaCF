import { TReachargesQuery } from "@/types/queries"
import { AllowedByUserIdFilter } from "./filters/allowed-by-user-id"
import { CheckablesFilter } from "./filters/checkables"
import { IntervalFilter } from "./filters/interval"
import { PaymentMethodsFilter } from "./filters/payment-method"
import { RolesFilter } from "./filters/roles"
import { StatusFilter } from "./filters/status"
import { UserIdFilter } from "./filters/user-id"

export const QueryGenerator = ({ query }: { query: TReachargesQuery }) => {
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-2 gap-2">
      <UserIdFilter query={query} />

      <AllowedByUserIdFilter query={query} />

      <PaymentMethodsFilter query={query} />

      <RolesFilter query={query} />

      <StatusFilter query={query} />

      <IntervalFilter query={query} />

      <CheckablesFilter query={query} />
    </div>
  )
}
