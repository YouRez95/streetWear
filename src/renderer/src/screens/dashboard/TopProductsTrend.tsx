import { Cell, Label, Pie, PieChart } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { topProductsTrend } from '@renderer/data/placeholder-data'
import { useMemo } from 'react'

const chartConfig = {
  quantity: {
    label: 'Quantity'
  },
  hoodie: {
    label: 'Hoodie Classic #123',
    color: 'hsl(var(--chart-1))'
  },
  tshirt: {
    label: 'T-Shirt',
    color: 'hsl(var(--chart-2))'
  },
  sweatpants: {
    label: 'Sweatpants Sport',
    color: 'hsl(var(--chart-3))'
  },
  jacket: {
    label: 'Jacket Windbreaker',
    color: 'hsl(var(--chart-4))'
  },
  cap: {
    label: 'Cap Flat-Bill',
    color: 'hsl(var(--chart-5))'
  },
  blook: {
    label: 'Blook',
    color: 'hsl(var(--primary))'
  },
  tricot: {
    label: 'Tricot',
    color: 'hsl(var(--secondary))'
  },
  polo: {
    label: 'Polo',
    color: 'hsl(var(--accent))'
  },
  jacketPolo: {
    label: 'Jacket Polo',
    color: 'hsl(var(--accent))'
  }
} satisfies ChartConfig

export function TopProductsTrend({ activeSeasonName }: { activeSeasonName: string | undefined }) {
  const totalProducts = useMemo(() => {
    return topProductsTrend.reduce((acc, curr) => acc + curr._sum.quantity, 0)
  }, [topProductsTrend])

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="pb-0 flex items-center justify-between w-full sm:flex-row">
        <CardTitle className="text-xl">🏆 Tendances des meilleurs produits</CardTitle>
        <CardDescription className="text-background font-bagel">{activeSeasonName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center gap-5">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full min-w-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="bg-foreground shadow-lg font-bagel text-background" />
              }
            />
            <Pie
              data={topProductsTrend}
              dataKey="_sum.quantity"
              nameKey="product.name"
              innerRadius={90}
              strokeWidth={5}
            >
              {topProductsTrend.map((entry, idx) => {
                const productKey = Object.keys(chartConfig).find(
                  (key) => chartConfig[key].label === entry.product.name
                )
                const color = productKey ? chartConfig[productKey].color : '#ccc'
                return <Cell key={`cell-${idx}`} fill={color} />
              })}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-background text-3xl font-bold"
                        >
                          {totalProducts.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-background"
                        >
                          Products
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 min-w-[300px]">
            <div className="flex justify-between border-b pb-2">
              <p>Produit</p>
              <p>Quantité</p>
            </div>
            {topProductsTrend.map((product) => {
              const productKey = Object.keys(chartConfig).find(
                (key) => chartConfig[key].label === product.product.name
              )
              const color = productKey ? chartConfig[productKey].color : '#ccc'
              return (
                <div className="flex justify-between">
                  <p>
                    <span
                      className="w-2 h-2 rounded-full inline-block mr-2"
                      style={{ backgroundColor: color }}
                    ></span>
                    {product.product.name}
                  </p>
                  <p>{product._sum.quantity.toLocaleString('fr-MA')}</p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
