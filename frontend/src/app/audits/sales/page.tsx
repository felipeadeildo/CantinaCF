"use client"

import { QueryGenerator } from "@/components/audits/sales/query-generator"
import { ProductSalesStats } from "@/components/audits/sales/stats"
import { ProductSalesTable } from "@/components/audits/sales/table"
import { LoginRequired } from "@/components/login-required"
import { TBSalesQuery } from "@/types/queries"
import { useState } from "react"

const Sales = () => {
  const query = useState<TBSalesQuery>({})
  return (
    <>
      <h1 className="text-xl my-2 text-center">Histórico de Compras</h1>
      <QueryGenerator query={query} />
      <ProductSalesTable query={query} />
      <ProductSalesStats query={query} />
    </>
  )
}

const ProtectedSales = () => {
  return (
    <LoginRequired allowed_roles={[1]}>
      <Sales />
    </LoginRequired>
  )
}

export default ProtectedSales
