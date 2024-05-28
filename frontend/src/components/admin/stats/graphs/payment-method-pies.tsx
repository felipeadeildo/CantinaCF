import { TStats } from "@/types/stats"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"
import { PaymentMethodMoneyPieChart } from "./payment-method-money-pie-chart"
import { PaymentMethodQuantityPieChart } from "./payment-method-quantity-pie-char"

type Props = {
  isLoading: boolean
  data?: TStats
}

const colorScale = scaleOrdinal(schemeCategory10)

export const PaymentMethodPies = ({ isLoading, data }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      <PaymentMethodQuantityPieChart
        data={data?.paymentMethodQuantity}
        isLoading={isLoading}
        colorScale={colorScale}
      />
      <PaymentMethodMoneyPieChart
        data={data?.paymentMethodMoney}
        isLoading={isLoading}
        colorScale={colorScale}
      />

      <div className="md:col-span-2 p-5 shadow-md rounded text-sm">
        <h3 className="text-sm font-bold mb-2 text-center">Métodos de Pagamento</h3>

        <ul className="w-full mt-2 flex flex-wrap gap-2 justify-center">
          {data &&
            data.paymentMethodMoney.map((item) => (
              <li key={item.paymentMethod} className="flex items-center mb-1">
                <span
                  className="block size-3 mr-2"
                  style={{ backgroundColor: colorScale(item.paymentMethod) }}
                />
                {item.paymentMethod}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
