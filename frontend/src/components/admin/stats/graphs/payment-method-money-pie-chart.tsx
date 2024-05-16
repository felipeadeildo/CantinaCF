import { maskMoney } from "@/lib/masks"
import { PaymentMethodStats } from "@/types/stats"
import { ScaleOrdinal } from "d3-scale"
import { Loader2 } from "lucide-react"
import { Pie } from "react-chartjs-2"

type Props = {
  isLoading: boolean
  data?: PaymentMethodStats
  colorScale: ScaleOrdinal<string, string>
}

const createChartData = (
  data: PaymentMethodStats,
  colorScale: ScaleOrdinal<string, string>
) => ({
  labels: data.map((item) => item.paymentMethod),
  datasets: [
    {
      label: "Quantidade de Pagamentos",
      data: data.map((item) => item.value),
      backgroundColor: data.map((item) => colorScale(item.paymentMethod)),
      borderColor: data.map((item) => colorScale(item.paymentMethod)),
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.label}: ${maskMoney(context.raw)}`
        },
      },
    },
  },
}

export const PaymentMethodMoneyPieChart = ({ isLoading, data, colorScale }: Props) => {
  const chartData = data
    ? createChartData(data, colorScale)
    : { labels: [], datasets: [] }

  return (
    <div className="w-full mx-auto p-2 shadow-md rounded">
      {isLoading && (
        <div className="flex justify-center items-center text-xl gap-2">
          <Loader2 className="animate-spin" />
          Carregando...
        </div>
      )}

      {!isLoading && (
        <div className="h-48 md:h-60">
          <Pie options={chartOptions} data={chartData} />
        </div>
      )}
    </div>
  )
}
