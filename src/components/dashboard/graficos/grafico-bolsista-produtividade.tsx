import React, { useEffect, useState } from "react";
import { Alert } from "../../ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,  ResponsiveContainer, LabelList } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { Info } from "lucide-react";

interface Research {
  among: number,
  satus: boolean,
  articles: number,
  book: number,
  book_chapters: number,
  id: string,
  name: string,
  university: string,
  lattes_id: string,
  area: string,
  lattes_10_id: string,
  abstract: string,
  city: string,
  orcid: string,
  image: string,
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
  h_index: string,
  relevance_score: string,
  works_count: string,
  cited_by_count: string,
  i10_index: string,
  scopus: string,
  openalex: string,
  subsidy: Bolsistas[],
  graduate_programs: GraduatePrograms[],
  departments: Departments[],
}

interface Departments {
  dep_des: string,
  dep_email: string,
  dep_nom: string,
  dep_id: string,
  dep_sigla: string,
  dep_site: string,
  dep_tel: string,
  img_data: string,
}

interface Bolsistas {
  aid_quantity: string,
  call_title: string,
  funding_program_name: string,
  modality_code: string,
  category_level_code: string,
  institute_name: string,
  modality_name: string,
  scholarship_quantity: string,
}

interface GraduatePrograms {
  graduate_program_id: string,
  name: string,
}

const chartConfig = {
  bar: {
    label: "Quantidade por Nível de Categoria (PQ)",
    color: "#004A75", // Cor única para todas as barras
  },
} satisfies ChartConfig;

export function GraficoBolsistasPQ({ researchers }: { researchers: Research[] }) {
  const [chartData, setChartData] = useState<{ category_level_code: string; count: number }[]>([]);
  useEffect(() => {
    if (!Array.isArray(researchers)) {
      console.error("The 'researchers' prop is not an array:", researchers);
      return;
    }

    const counts: { [key: string]: number } = {};

    // Filtra os bolsistas com modality_code == "DT" e conta por category_level_code
    researchers.forEach(researcher => {
      researcher.subsidy.forEach(bolsista => {
        if (bolsista.modality_code === "PQ") {
          const categoryLevel = bolsista.category_level_code;
          counts[categoryLevel] = (counts[categoryLevel] || 0) + 1;
        }
      });
    });

    // Transforma o objeto de contagem em um array para o gráfico
    const data = Object.entries(counts).map(([category_level_code, count]) => ({
      category_level_code,
      count,
    }));

    // Ordena os dados em ordem numérica (1A, 1B, 2, etc.)
    const sortedData = data.sort((a, b) => {
      const aCode = a.category_level_code.toUpperCase();
      const bCode = b.category_level_code.toUpperCase();

      // Extrai o número e a letra (se houver) do código
      const aNumber = parseInt(aCode.match(/\d+/)?.[0] || "0", 10);
      const bNumber = parseInt(bCode.match(/\d+/)?.[0] || "0", 10);

      // Compara os números
      if (aNumber !== bNumber) {
        return aNumber - bNumber;
      }

      // Se os números forem iguais, compara as letras
      const aLetter = aCode.match(/[A-Za-z]+/)?.[0] || "";
      const bLetter = bCode.match(/[A-Za-z]+/)?.[0] || "";
      return aLetter.localeCompare(bLetter);
    });

    setChartData(sortedData);
  }, [researchers]);

  return (
   <Alert>
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                          <div>
                                                            <CardTitle className="text-sm font-medium">
                                                            Gráfico Produtividade em Pesquisa
                                                            </CardTitle>
                                                            <CardDescription>Total por categoria</CardDescription>
                                                          </div>
                                      
                                                          <TooltipProvider>
                                                            <Tooltip>
                                                              <TooltipTrigger> <Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                                              <TooltipContent>
                                                                <p>Fonte: Painel Bolsistas CNPq</p>
                                                              </TooltipContent>
                                                            </Tooltip>
                                                          </TooltipProvider>
                                      
                                                        </CardHeader>

                                                        <CardContent className="flex py-0 flex-1  items-center justify-center">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
          
            <XAxis
              dataKey="category_level_code"
              tickLine={false}
              axisLine={false}

              fontSize={12} // Tamanho da fonte das legendas
            />
           
           <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
              dataKey="count"
              fill={chartConfig.bar.color} // Cor única para todas as barras
              radius={4}
            
            
            >
              <LabelList
                dataKey="count"
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={12}
                fill="#000000" // Cor fixa para as legendas no topo das barras
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
   </Alert>
  );
}