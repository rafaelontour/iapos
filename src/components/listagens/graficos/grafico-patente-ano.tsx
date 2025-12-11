import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import {
  BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent
} from "../../../components/ui/chart";


interface Total {
  year:number
  granted:number
  not_granted:number
}

const chartConfig = {
  granted: {
    label: "Concedida",
    color: "#22C55E",
  },
  not_granted: {
    label: "Não concedida",
    color: "#EF4444",
  },
};

export function GraficoTotalPatentes({ total }: { total: Total[] }) {
  const [chartData, setChartData] = useState<Total[]>([]);
 
   useEffect(() => {
     if (total) {
       setChartData(total);
     }
   }, [total]);
 

  return (
    <Alert className="pt-12">
    <ChartContainer config={chartConfig} className="w-full h-[250px]">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
          <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
          <CartesianGrid vertical={false} horizontal={false} />
          <ChartLegend
            className="flex flex-nowrap whitespace-nowrap mt-2 p-4 rounded-md gap-1 w-full text-[0.6rem] overflow-x-auto overflow-y-hidden md:text-[0.7rem] md:gap-2"
            content={<ChartLegendContent />}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          {Object.entries(chartConfig).map(([key, config], index) => (
  <Bar
    key={key}
    dataKey={key}
    fill={config.color}
    radius={4}
    stackId="a" // 👈 necessário para empilhar
  >
    {index === Object.entries(chartConfig).length - 1 && (
      <LabelList
        position="top"
        offset={12}
        className="fill-foreground"
        fontSize={12}
      />
    )}
  </Bar>
))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </Alert>
  );
}
