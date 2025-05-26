import { Card, CardContent } from '@/components/ui/card'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const data = [
  { week: '2025-W15', cashIn: 99500, cashOut: 68750, net: 30750 },
  { week: '2025-W14', cashIn: 72500, cashOut: 93000, net: -20500 },
  { week: '2025-W13', cashIn: 119800, cashOut: 81500, net: 38300 },
  { week: '2025-W12', cashIn: 63800, cashOut: 70200, net: -6400 },
  { week: '2025-W11', cashIn: 107250, cashOut: 54100, net: 53150 }
]

export default function CashFlowChart() {
  return (
    <Card className="w-full flex-1 mx-auto p-4">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold mb-4">Flux de trésorerie hebdo</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="cashIn"
              stroke="#4ade80"
              name="Entrées"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="cashOut"
              stroke="#f87171"
              name="Sorties"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#60a5fa"
              name="Net"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
