"use client"

import { LoginRequired } from "@/components/login-required"

const Stats = () => {
  return (
    <div className="divide-y-4 space-y-3 divide-primary">
      <div>Informações do Usuário Selecionado</div>
      <div>Filtro para Selecionar Usuário e Intervalo</div>
      <div>Gráfico de barras dos k Produtos mais comprados deste usuário</div>
      <div>
        Dois gráficos de Pizza um com quantidade de money por método de pagamento e outro
        quantidade de pagamentor por método de pagamento
      </div>
      <div>
        Aba Collapsável contendo informação dos afiliados (vai poder selecionar o afiliado
        dentre os afiliados). Esta aba deve mostrar quando cada afiliado fez de recarga
        colocando como folha de pagamento e um histórico de suas recargas numa tabela
        minificada (pode ser um popUp)
      </div>
      <div>
        Aqui vai aparecer o histórico de recargas de folha de pagamento do usuário em
        questão (ou eu posso aproveitar a div de cima, vai dar na mesma colcoando &quot;vc
        como afiliado de vc mesmo&quot;)
      </div>
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
