import { Button } from "@/components/ui/button"
import { TSalesQuery } from "@/types/queries"
import { BarChart3 } from "lucide-react"

export const ProductSalesStats = ({
  query: [query, setQuery],
}: {
  query: TSalesQuery
}) => {
  return (
    <Button className="fixed bottom-4 left-4">
      <BarChart3 />
      Ver Estatísticas
    </Button>
  )
}
