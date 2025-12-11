import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "../../ui/chart";
import { Alert } from "../../ui/alert";

interface Total {
  year: string;
  among: number;
}

const chartConfig = {
  livros: {
    label: "Capítulos de livros",
    color: "#E8ACD2",
  },
};

export function GraficoTotalCapitulos({ total }: { total: Total[] }) {
  const [chartData, setChartData] = useState<{ year: string; livros: number }[]>([]);

  useEffect(() => {
    const data = total.map(item => ({
      year: item.year,
      livros: item.among
    }));
    setChartData(data);
  }, [total]);

  return (
    <Alert className="pt-12">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
        
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
              dataKey="livros"
              fill={chartConfig.livros.color}
              radius={4}
            >
              <LabelList
                dataKey="livros"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Alert>
  );
}
