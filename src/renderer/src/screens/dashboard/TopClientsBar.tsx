import { Card, CardContent } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const topClients = [
  { client: 'Atlas Fashion SARL', dh: 286_400 },
  { client: 'Casablanca Streetwear', dh: 214_750 },
  { client: 'Marrakech Souk Trends', dh: 172_300 },
  { client: 'Tangier Coastal Style', dh: 149_900 },
  { client: 'Fès Couture House', dh: 131_250 },
  { client: 'Rabat Urban Apparel', dh: 119_800 },
  { client: 'Agadir Surf Lines', dh: 98_600 },
  { client: 'Oujda Textile Group', dh: 87_450 }
]

export default function TopClientsBar() {
  return (
    <Card className="w-full flex-1 mx-auto p-4">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold mb-4">🏅 Best Clients (Revenue)</h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical" // horizontal bars
            data={topClients}
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(v) => v.toLocaleString('fr-MA', { maximumFractionDigits: 0 })}
            />
            <YAxis dataKey="client" type="category" width={180} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString('fr-MA')} DH`} />

            <Bar dataKey="dh" name="Revenu" strokeWidth={1}>
              <LabelList
                dataKey="dh"
                position="right"
                formatter={(v: number) => v.toLocaleString('fr-MA', { maximumFractionDigits: 0 })}
                className="text-sm font-medium"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
