import { ProductSaleStats } from "@/types/stats"
import { Loader2 } from "lucide-react"
import { Bar } from "react-chartjs-2"
import { useMediaQuery } from "usehooks-ts"

type Props = {
  isLoading: boolean
  data?: ProductSaleStats
}

const createChartData = (data: ProductSaleStats) => ({
  labels: data.reverse().map((item) => item.product),
  datasets: [
    {
      label: "Quantidade vendida",
      data: data.map((item) => item.value),
      backgroundColor: "#22C55E",
      borderColor: "#055422",
      borderWidth: 1,
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        maxRotation: 20,
        minRotation: 20,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: (item: any) => `${item.parsed.y} vendas`,
      },
    },
  },
}

export const TopSellingProducts = ({ isLoading, data }: Props) => {
  const isWindowLarge = useMediaQuery("(min-width: 768px)")

  const chartData = data
    ? createChartData(isWindowLarge ? data : data.slice(0, 5))
    : { labels: [], datasets: [] }

  return (
    <div className="flex justify-center w-full mx-auto p-1 shadow-md rounded">
      {isLoading && (
        <div className="flex justify-center items-center text-xl">
          <Loader2 className="animate-spin" />
          Carregando...
        </div>
      )}
      {!isLoading && (
        <div className="relative w-full h-64">
          <Bar options={chartOptions} data={chartData} />
        </div>
      )}
    </div>
  )
}
