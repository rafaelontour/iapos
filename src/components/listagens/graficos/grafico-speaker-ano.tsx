import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import {
  BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid, ResponsiveContainer
} from "recharts";
import {
  ChartConfig, ChartContainer, ChartTooltip,
  ChartTooltipContent, ChartLegend, ChartLegendContent
} from "../../../components/ui/chart";

interface Total {
  year: number;
  congress: number;
  meeting: number;
  workshop: number;
  other: number;
  seminar: number;
  symposium: number;
}

const chartConfig = {
  congress: { label: "Congresso", color: "#FF5800" },
  meeting: { label: "Encontro", color: "#E9A700" },
  workshop: { label: "Oficina", color: "#FCEE21" },
  other: { label: "Outra", color: "#7F400B" },
  seminar: { label: "Seminário", color: "#FFBD7B" },
  symposium: { label: "Simpósio", color: "#D53A2C" },
} as ChartConfig;

export function GraficoTotalParticipacaoEventos({ total }: { total: Total[] }) {
  const [chartData, setChartData] = useState<Total[]>([]);

  useEffect(() => {
    setChartData(total);
  }, [total]);

  return (
    <Alert className="pt-12">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
          
            <CartesianGrid vertical={false} horizontal={false} />
            <ChartLegend className="flex flex-wrap" content={<ChartLegendContent />} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />

            {Object.keys(chartConfig).map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={chartConfig[key].color}
                radius={4}
              >
                {index === Object.keys(chartConfig).length - 1 && (
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Alert>
  );
}
