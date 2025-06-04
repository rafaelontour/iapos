import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "../../../components/ui/chart";

type Total = {
  year: number;
  among: number;
  qualis: {
    A1: number;
    A2: number;
    A3: number;
    A4: number;
    B1: number;
    B2: number;
    B3: number;
    B4: number;
    C: number;
    SQ: number;
  };
  jcr: {
    very_low: number;
    low: number;
    medium: number;
    high: number;
    not_applicable: number;
    without_jcr: number;
  };
  citations: number;
};

export function GraficoTotalCitacoes({ total }: { total: Total[] }) {
  const [chartData, setChartData] = useState<{ year: number; citations: number }[]>([]);

  useEffect(() => {
    if (total) {
      const data = [...total]
        .sort((a, b) => a.year - b.year) // ordena por ano crescente
        .map(item => ({
          year: item.year,
          citations: item.citations,
        }));
      setChartData(data);
    }
  }, [total]);

  return (
    <Alert className="pt-12">
      <ChartContainer config={{ citations: { label: "Citações", color: "#2BC8DC" } }} className="h-[250px] w-full">
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
           
            <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
           
            <ChartLegend
              className="flex flex-wrap text-[0.6rem] md:text-[0.8rem]"
              content={<ChartLegendContent />}
            />
            <RechartsTooltip content={<ChartTooltipContent indicator="dashed" />} />
            <Line
              type="monotone"
              dataKey="citations"
              stroke="#2BC8DC"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="citations"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Alert>
  );
}
