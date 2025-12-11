import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import {
  BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent
} from "../../../components/ui/chart";

// Define o tipo de dado esperado
interface Total {
  year: number;
  m_completed: number;
  m_in_progress: number;
  ic_completed: number;
  ic_in_progress: number;
  d_completed: number;
  d_in_progress: number;
  g_completed: number;
  g_in_progress: number;
  e_in_progress: number;
  sd_completed: number;
  sd_in_progress: number;
}

const orientacaoConfig = {
  m_completed: { label: "Mestrado Concluído", color: "#67A896" },
  m_in_progress: { label: "Mestrado Em Andamento", color: "#A8CCC9" },
  ic_completed: { label: "IC Concluída", color: "#8BFBD3" },
  ic_in_progress: { label: "IC Em Andamento", color: "#5DD3B6" },
  d_completed: { label: "Doutorado Concluído", color: "#425450" },
  d_in_progress: { label: "Doutorado Em Andamento", color: "#6A8280" },
  g_completed: { label: "TCC Concluído", color: "#77D2B6" },
  g_in_progress: { label: "TCC Em Andamento", color: "#99E3D0" },
  e_in_progress: { label: "Especialização Em Andamento", color: "#2F7F7C" },
  sd_completed: { label: "Pós-doc Concluído", color: "#46724B" },
  sd_in_progress: { label: "Pós-doc Em Andamento", color: "#679975" }
};

export function GraficoTotalOrientacoes({ total }: { total: Total[] }) {
  const [chartData, setChartData] = useState<Total[]>([]);

  useEffect(() => {
    if (total) {
      setChartData(total);
    }
  }, [total]);

  return (
    <Alert className="pt-12">
      <ChartContainer config={orientacaoConfig} className="w-full h-[280px]">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <CartesianGrid vertical={false} horizontal={false} />
            <ChartLegend
              className="flex flex-wrap gap-2 whitespace-nowrap"
              content={<ChartLegendContent />}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
  
            {Object.entries(orientacaoConfig).map(([key, config], index, array) => (
              <Bar
                key={key}
                dataKey={key}
                fill={config.color}
                stackId="a"
                radius={
                4
                }
              >
                {index === array.length - 1 && (
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
