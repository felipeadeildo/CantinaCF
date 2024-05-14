import { ComboboxProducts } from "@/components/combobox/products"
import { ComboboxUsers } from "@/components/combobox/users"
import { TSalesQuery } from "@/types/queries"
import { IntervalFilter } from "../recharges/filters/interval"

export const QueryGenerator = ({ query: [query, setQuery] }: { query: TSalesQuery }) => {
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 my-2">
      <ComboboxUsers
        onUserSelected={(user) => setQuery({ ...query, soldToUserId: user?.id })}
      />

      <ComboboxProducts
        onProductSelected={(product) => setQuery({ ...query, productId: product?.id })}
      />

      <IntervalFilter query={[query, setQuery]} />
    </div>
  )
}
