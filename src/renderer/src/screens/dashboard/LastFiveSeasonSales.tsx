'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { lastFiveSeasonSales } from '@renderer/data/placeholder-data'

const chartConfig = {
  season: {
    label: 'Season',
    color: 'hsl(var(--secondary))'
  },
  products: {
    label: 'Products',
    color: 'hsl(var(--secondary))'
  },
  label: {
    color: 'hsl(var(--secondary))'
  }
} satisfies ChartConfig

export function LastFiveSeasonSales({
  activeSeasonName
}: {
  activeSeasonName: string | undefined
}) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-0 flex items-center justify-between w-full sm:flex-row">
        <CardTitle className="text-xl">Ventes des 5 dernières saisons</CardTitle>
        <CardDescription className="text-background font-bagel">{activeSeasonName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full gap-2" style={{ height: 250, maxHeight: 250 }}>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={lastFiveSeasonSales}
              layout="vertical"
              margin={{
                right: 16
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="season"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="products" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    className="bg-foreground shadow-lg font-bagel text-background"
                  />
                }
              />
              <Bar
                dataKey="products"
                layout="vertical"
                fill="hsl(var(--secondary))"
                radius={4}
                barSize={50}
              >
                <LabelList
                  dataKey="season"
                  position="insideLeft"
                  offset={8}
                  className="fill-foreground font-bold bg-secondary text-base"
                  fontSize={12}
                />
                <LabelList
                  dataKey="products"
                  position="right"
                  offset={8}
                  className="fill-background font-bold text-[14px]"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
