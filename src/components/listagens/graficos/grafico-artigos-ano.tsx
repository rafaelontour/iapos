import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import {
  ChartConfig,
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

const chartConfig = {
  A1: {
    label: "Qualis A1",
    color: "#006837",
  },
  A2: {
    label: "Qualis A2",
    color: "#8FC53E",
  },
  A3: {
    label: "Qualis A3",
    color: "#ACC483",
  },
  A4: {
    label: "Qualis A4",
    color: "#BDC4B1",
  },
  B1: {
    label: "Qualis B1",
    color: "#F15A24",
  },
  B2: {
    label: "Qualis B2",
    color: "#F5831F",
  },
  B3: {
    label: "Qualis B3",
    color: "#F4AD78",
  },
  B4: {
    label: "Qualis B4",
    color: "#F4A992",
  },
  C: {
    label: "Qualis C",
    color: "#EC1C22",
  },
  SQ: {
    label: "Sem qualis",
    color: "#560B11",
  },
} satisfies ChartConfig;

export function GraficoTotalArtigo({ total }: { total: Total[] }) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (total) {
      const sorted = [...total].sort((a, b) => a.year - b.year); // ordena por ano crescente
  
      const data = sorted.map((item) => ({
        year: item.year,
        ...item.qualis,
      }));
  
      setChartData(data);
    }
  }, [total]);
  

  return (
    <Alert className="pt-12">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
            <CartesianGrid vertical={false} horizontal={false} />
            <ChartLegend
              className="flex flex-wrap text-[0.6rem] md:text-[0.8rem]"
              content={<ChartLegendContent />}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {Object.keys(chartConfig).map((key, index, array) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig[key].color}
                stackId="a"
                radius={4}
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
