import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import { BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../../components/ui/chart";

// Function to normalize strings by removing accents and converting to lowercase
const normalizeString = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

type Livro = {
  id: string;
  nature: string;
  oriented: string;
  status: string;
  title: string;
  type: string;
  year: string;
};

// Normalized chart config
const normalizedChartConfig: ChartConfig = {
  "iniciacao cientifica": {
    label: "Iniciacao cientifica",
    color: "#8BFBD3",
  },
  "dissertacao de mestrado": {
    label: "Dissertação De Mestrado",
    color: "#67A896",
  },
  "tese de doutorado": {
    label: "Tese de Doutorado",
    color: "#425450",
  },
  "trabalho de conclusao de curso graduacao": {
    label: "Trabalho de Conclusao de Curso Graduação",
    color: '#77D2B6',
  },
  "orientacao-de-outra-natureza": {
    label: "Orientacao-De-Outra-Natureza",
    color: '#577E74',
  },
  "monografia de conclusao de curso aperfeicoamento e especializacao": {
    label: "Monografia de Conclusao de Curso Aperfeicoamento e Especializacao",
    color: '#2F7F7C',
  },
  "supervisao de pos-doutorado": {
    label: "Supervisão de Pós-Doutorado",
    color: '#46724B',
  },
};

export function GraficoOrientacoes(props: { livros: Livro[] }) {
  const [chartData, setChartData] = useState<{ total: number; year: string; }[]>([]);

  useEffect(() => {
    if (props.livros) {
      const data: { [year: string]: { [nature: string]: number; total: number } } = {};

      props.livros.forEach((livro) => {
        const normalizedNature = normalizeString(livro.nature);

        if (!data[livro.year]) {
          data[livro.year] = { total: 0 };
        }
        if (!data[livro.year][normalizedNature]) {
          data[livro.year][normalizedNature] = 0;
        }
        data[livro.year][normalizedNature] += 1;
        data[livro.year].total += 1;
      });

      const formattedData = Object.entries(data).map(([year, counts]) => {
        return { year, ...counts };
      });

      setChartData(formattedData);
    }
  }, [props.livros]);

  return (
    <Alert className="pt-12">
      <ChartContainer config={normalizedChartConfig} className="w-full h-[250px]">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
            <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
            <CartesianGrid vertical={false} horizontal={false} />
            <ChartLegend
              className="
                flex flex-nowrap whitespace-nowrap mt-2 p-4 rounded-md
                gap-1 w-full text-[0.6rem]
                overflow-x-auto overflow-y-hidden
                
                md:text-[0.7rem] md:gap-2

                
              "
              content={<ChartLegendContent />} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            {Object.keys(normalizedChartConfig).map((nature, index) => (
              <Bar key={nature} dataKey={nature} stackId="a" fill={normalizedChartConfig[nature].color} radius={4}>
                {index === Object.keys(normalizedChartConfig).length - 1 && (
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
