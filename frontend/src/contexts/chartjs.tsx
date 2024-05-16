"use client"
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"

import { useEffect } from "react"

export const ChartJsProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    ChartJS.register(
      ArcElement,
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    )
  }, [])

  return <>{children}</>
}
