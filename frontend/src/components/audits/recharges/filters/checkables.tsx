import { Checkbox } from "@/components/ui/checkbox"
import { TReachargesQuery } from "@/types/queries"

export const CheckablesFilter = ({
  query: [query, setQuery],
}: {
  query: TReachargesQuery
}) => {
  return (
    <div className="flex flex-col gap-0.5 justify-center pl-2 md:col-start-2 sm:col-start-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={query.onlyIsPayroll}
          onCheckedChange={() => {
            setQuery({ ...query, onlyIsPayroll: !query.onlyIsPayroll })
          }}
        />
        <label htmlFor="only_balance">
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Somente Folha de Pagamento
          </span>
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={query.onlyIsPayPayroll}
          onCheckedChange={() => {
            setQuery({ ...query, onlyIsPayPayroll: !query.onlyIsPayPayroll })
          }}
        />
        <label htmlFor="only_balance">
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Somente Pagamento da Folha de Pagamento
          </span>
        </label>
      </div>
    </div>
  )
}
