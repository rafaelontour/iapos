import { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,  ResponsiveContainer, LabelList, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../../components/ui/chart";
import { Research } from "../researchers-home";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Tooltip ,TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { Info } from "lucide-react";

type ResearchData = {
  researchers: Research[];
};

// Definição das cores para cada área (fora do chartConfig)
const areaColors = {
  "CIENCIAS AGRARIAS": "#EF4444", // bg-red-400
  "CIENCIAS EXATAS E DA TERRA": "#34D399", // bg-green-400
  "CIENCIAS DA SAUDE": "#20BDBE", // bg-[#20BDBE]
  "CIENCIAS HUMANAS": "#F5831F", // bg-[#F5831F]
  "CIENCIAS BIOLOGICAS": "#EB008B", // bg-[#EB008B]
  "ENGENHARIAS": "#FCB712", // bg-[#FCB712]
  "CIENCIAS SOCIAIS APLICADAS": "#009245", // bg-[#009245]
  "LINGUISTICA LETRAS E ARTES": "#A67C52", // bg-[#A67C52]
  "OUTROS": "#1B1464", // bg-[#1B1464]
  "DEFAULT": "#000000", // bg-[#000]
};

const chartConfig = {
  areas: {
    label: "Áreas de Atuação",
  },
} satisfies ChartConfig;

export function GraficoAreaPesquisares(props: ResearchData) {
  const [chartData, setChartData] = useState<{ area: string; count: number }[]>([]);

  useEffect(() => {
    if (props.researchers) {
      const counts: { [area: string]: number } = {};

      // Conta a quantidade de pesquisadores por área
      props.researchers.forEach((researcher) => {
        // Divide as áreas pelo caractere ";"
        const areas = researcher.area
          .split(";")
          .map((area) => area.trim().toUpperCase())
          .filter((area) => area !== ""); // Ignora áreas vazias

        areas.forEach((area) => {
          if (!counts[area]) {
            counts[area] = 0;
          }
          counts[area] += 1;
        });
      });

      // Transforma o objeto em um array para o gráfico
      const data = Object.entries(counts).map(([area, count]) => ({
        area,
        count,
      }));

      setChartData(data);
    }
  }, [props.researchers]);

  // Função para obter a cor da área
  const getAreaColor = (area: string) => {
    if (area.includes("CIENCIAS AGRARIAS")) return areaColors["CIENCIAS AGRARIAS"];
    if (area.includes("CIENCIAS EXATAS E DA TERRA")) return areaColors["CIENCIAS EXATAS E DA TERRA"];
    if (area.includes("CIENCIAS DA SAUDE")) return areaColors["CIENCIAS DA SAUDE"];
    if (area.includes("CIENCIAS HUMANAS")) return areaColors["CIENCIAS HUMANAS"];
    if (area.includes("CIENCIAS BIOLOGICAS")) return areaColors["CIENCIAS BIOLOGICAS"];
    if (area.includes("ENGENHARIAS")) return areaColors["ENGENHARIAS"];
    if (area.includes("CIENCIAS SOCIAIS APLICADAS")) return areaColors["CIENCIAS SOCIAIS APLICADAS"];
    if (area.includes("LINGUISTICA LETRAS E ARTES")) return areaColors["LINGUISTICA LETRAS E ARTES"];
    if (area.includes("OUTROS")) return areaColors["OUTROS"];
    return areaColors["DEFAULT"];
  };

  return (
    <Alert className="p">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <div>
                                            <CardTitle className="text-sm font-medium">
                                              Quantidade total por área 
                                            </CardTitle>
                                            <CardDescription>Soma de área cadastrada no Lattes pelos pesquisadores</CardDescription>
                                          </div>
                      
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger> <Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                              <TooltipContent>
                                                <p>Fonte: Currículo Lattes</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                      
                                        </CardHeader>
     <CardContent>
     <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="area" tickLine={false} tickMargin={10} axisLine={false} />
            
            
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
            radius={4}
              dataKey="count"
              fill="#8884d8" // Cor padrão (pode ser substituída pela cor da área)
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getAreaColor(entry.area)} />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={12}
                fill="#919191" // Cor fixa para a legenda no topo da barra
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
     </CardContent>
    </Alert>
  );
}