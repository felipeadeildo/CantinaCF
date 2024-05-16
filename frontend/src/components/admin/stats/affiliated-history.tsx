import { TStatsQuery } from "@/types/queries"

type Props = {
  query: TStatsQuery
}

export const AffiliatedHistory = ({ query: [query, setQuery] }: Props) => {
  return (
    <div>
      Aba Collapsável contendo informação dos afiliados (vai poder selecionar o afiliado
      dentre os afiliados). Esta aba deve mostrar quando cada afiliado fez de recarga
      colocando como folha de pagamento e um histórico de suas recargas numa tabela
      minificada (pode ser um popUp)
    </div>
  )
}
