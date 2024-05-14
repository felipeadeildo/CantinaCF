import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TReachargesQuery } from "@/types/queries"

export const StatusFilter = ({
  query: [query, setQuery],
}: {
  query: TReachargesQuery
}) => {
  return (
    <Select onValueChange={(value) => setQuery({ ...query, status: value })}>
      <SelectTrigger className="max-w-xs w-full h-9 rounded-md px-3 text-xs">
        <SelectValue placeholder="Selecionar Status do Pagamento" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="to allow">Aguardando Liberação</SelectItem>
          <SelectItem value="accepted">Aceito</SelectItem>
          <SelectItem value="rejected">Rejeitado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
