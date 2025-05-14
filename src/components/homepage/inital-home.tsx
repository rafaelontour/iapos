
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { UserContext } from "../../context/context";
import bg_graduate from '../../assets/bg_home.png'
import bg_popup from '../../assets/bg_popup.png';

import {
  Book,
  Books,

  ChartBar,

  ChartLine,

  Copyright,

  Quotes,

} from "phosphor-react";
import { ArrowRight, BarChartBig, Blocks, Download, File, GraduationCap, Info, InfoIcon, Link2, List } from "lucide-react";
import { Alert } from "../ui/alert";
import { useModalHomepage } from "../hooks/use-modal-homepage";


interface VisaoPrograma {
  article: number;
  book: number;
  book_chapter: number;
  brand: number;
  patent: number;
  researcher: number;
  software: number;
  work_in_event: number;
}

interface Rt {
  teachers: CoutRt[]
  technician: CoutRt[]
}

interface CoutRt {
  count: number
  rt: string
}

interface GrupoPesquisa {
  nome_grupo: string
  nome_lider: string
  institution_id: string
  area: string
  ultimo_envio: string
  situacao: string
}




import { Link, useNavigate } from "react-router-dom";

import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, PieChart, Pie, LabelList, Cell, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Label as LabelChart } from 'recharts';

type Count = {
  count_article: number
  count_book: number
  count_book_chapter: number,
  count_guidance: number
  count_patent: number
  count_report: number
  count_software: number
  count_guidance_complete: number
  count_guidance_in_progress: number
  count_patent_granted: number
  count_patent_not_granted: number
  count_brand: number
  year: number
}

interface PalavrasChaves {
  term: string;
  among: number;
}

import {
  ChartConfig,
  ChartContainer,
} from "../../components/ui/chart"

import Highcharts from "highcharts";
import HC_wordcloud from 'highcharts/modules/wordcloud';

import { useTheme } from "next-themes";
import { Search } from "../search/search";
import { useModalResult } from "../hooks/use-modal-result";
import { useModal } from "../hooks/use-modal-store";
import { Helmet } from "react-helmet";
import { Research } from "./categorias/researchers-home";


interface Bolsistas {
  aid_quantity: string
  call_title: string
  funding_program_name: string
  modality_code: string
  category_level_code: string
  institute_name: string
  modality_name: string
  name: string
  researcher_id: string
  scholarship_quantity: string
}

HC_wordcloud(Highcharts);

const chartConfig = {
  views: {
    label: "Page Views",
  },
  producao_bibliografica: {
    label: "Produção bibliográfica",
    color: "hsl(var(--chart-1))",
  },
  producao_tecnica: {
    label: "Produção técnica",
    color: "hsl(var(--chart-2))",
  },
  count_article: {
    label: "Artigos",
    color: "hsl(var(--chart-2))",
  },
  count_book: {
    label: "Livros",
    color: "hsl(var(--chart-2))",
  },
  count_book_chapter: {
    label: "Capítulos de livros",
    color: "hsl(var(--chart-2))",
  },
  count_patent: {
    label: "Patentes",
    color: "hsl(var(--chart-2))",
  },
  count_brand: {
    label: "Marcas",
    color: "hsl(var(--chart-2))",
  },
  count_software: {
    label: "Softwares",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export function InitialHome() {
  const [VisaoPrograma, setVisaoPrograma] = useState<VisaoPrograma[]>([]);
  const { setItensSelecionados, urlGeral, version } = useContext(UserContext);

  const [year, setYear] = useState(new Date().getFullYear() - 4);

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear; i > currentYear - 30; i--) {
    years.push(i);
  }


  let urlGrupo = `${urlGeral}foment`

  const [grupos, setGrupos] = useState<GrupoPesquisa[]>([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await fetch(urlGrupo, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setGrupos(data)

        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData()


  }, [urlGrupo]);

  const urlRt = `${urlGeral}departament/rt`

  const [rt, setRt] = useState<Rt | null>(null);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await fetch(urlRt, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setRt(data)

        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData()


  }, [urlRt]);

  // Função para somar os counts de technician
  const sumTechnicianCounts = (technician: CoutRt[]): number => {
    return technician.reduce((total, item) => total + item.count, 0);
  };

  const { theme } = useTheme();

  const urlVisaoPrograma = `${urlGeral}/graduate_program_production?graduate_program_id=0&year=1900`;
  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlVisaoPrograma, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setVisaoPrograma(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlVisaoPrograma]);

  const [loading, isLoading] = useState(false)

  const [dados, setDados] = useState<Count[]>([]);

  let urlDados = `${urlGeral}ResearcherData/DadosGerais?year=${year}`

  useEffect(() => {
    const fetchData = async () => {
      try {
        isLoading(true)
        const response = await fetch(urlDados, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setDados(data);
          isLoading(false)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlDados]);

  const { isOpen, type } = useModalHomepage();


  const isModalOpen = isOpen && type === "initial-home";


  console.log(urlDados)

  //palavars
  const [words, setWords] = useState<PalavrasChaves[]>([]);
  let urlPalavrasChaves = `${urlGeral}lists_word_researcher?graduate_program_id=&researcher_id=`

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await fetch(urlPalavrasChaves, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'text/plain'
          }
        });
        const data = await response.json();
        if (data) {
          setWords(data);
        }
      } catch (err) {
        console.log(err);
      } finally {

      }
    };
    fetchData();
  }, []);

  const options = {
    chart: {
      backgroundColor: 'transparent',
      height: '300px',
      display: 'flex',
      position: 'relative'
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false, // Remove a opção de menu para baixar o gráfico
    },
    series: [
      {
        type: 'wordcloud',
        data: words.map((word) => ({
          name: word.term,
          weight: word.among,
        })),

        style: {
          fontFamily: 'Lexend, sans-serif',
        },
      },
    ],
    title: {
      text: '',
    },
    plotOptions: {
      wordcloud: {
        borderRadius: 3,
        borderWidth: "1px",
        borderColor: 'blue',
        BackgroundColor: 'red',
        colors: ['#9CBCCE', '#284B5D', '#709CB6'],

      },
    },
  };

  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('producao_bibliografica')

  const total = useMemo(
    () => ({
      producao_bibliografica: dados.reduce(
        (acc, curr) => acc + curr.count_article + curr.count_book + curr.count_book_chapter,
        0
      ),
      producao_tecnica: dados.reduce((acc, curr) => acc + curr.count_patent + curr.count_software + curr.count_brand, 0),
    }),
    [dados]
  );

  const [visibleChart, setVisibleChart] = useState(0);
  const chartKeys = ['count_article', 'count_patent', 'count_guidance_in_progress'];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChart((prev) => (prev + 1) % chartKeys.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [chartKeys.length]);


  const navigate = useNavigate();

  function handlePesquisaChange(term: string) {
    setItensSelecionados([{ term }]);

    navigate(`/resultados?type_search=article&terms=${term}`)

  }

  const [bolsistas, setBolsistas] = useState<Bolsistas[]>([]);

  const urlBolsistas = urlGeral + `foment`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlBolsistas, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setBolsistas(data)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData()

  }, [urlBolsistas]);

  const pqCount = bolsistas.filter(b => b.modality_code === 'PQ').length;
  const dtCount = bolsistas.filter(b => b.modality_code === 'DT').length;
  const totalCountR = Number(VisaoPrograma.map((props) => (props.researcher)))

  const chartData = [
    { name: 'Produtividade em Pesquisa', value: pqCount },
    { name: 'Desen. Tec. e Extensão Inovadora', value: dtCount },
    { name: 'Outros docentes', value: totalCountR - pqCount - dtCount },
  ];

  const { onOpen: onOpenResult } = useModalResult();

  const { onOpen } = useModal()

    const [researcher, setResearcher] = useState<Research[]>([]);
      let urlTermPesquisadores = `${urlGeral}outstanding_researchers`
console.log(urlTermPesquisadores)
const [isLoad, setLoad] = useState(false)
       useMemo(() => {
                  const fetchData = async () => {
                      try {
                        setLoad(true)
                        const response = await fetch(  urlTermPesquisadores, {
                          mode: "cors",
                          headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET",
                            "Access-Control-Allow-Headers": "Content-Type",
                            "Access-Control-Max-Age": "3600",
                            "Content-Type": "text/plain",
                          },
                        });
                        const data = await response.json();
                        if (data) {
                          setLoad(false)
                          setResearcher(data);
                          
                        }
                      } catch (err) {
                        console.log(err);
                        setLoad(false)
                      }
                    };
                    fetchData();
                  }, [urlTermPesquisadores]);

                   const randomResearchers = useMemo(() => {
                                return researcher.sort(() => Math.random() - 0.5).slice(0, 40);
                              }, [researcher]);
                  
 const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
 
 const nomesAleatorios = Array.from({ length: 20 }, (_, i) => ({
  name: `Pesquisador ${i + 1}`,
}));

 return (
    <div className=" items-center  flex flex-col   ">
  <Helmet>
  <title>{`Página Inicial | Iapós`}    </title>
  <meta name="description" content={`Página Inicial | ${version ? 'Conectee' : 'Simcc'}`} />
  <meta name="robots" content="index, follow" />
</Helmet>
      <div className="bg-cover  bg-no-repeat bg-center w-full" >
        <div className="h-[0vh] z-[-1] opacity-45">
          <ChartContainer config={chartConfig} className="h-[55vh] w-full">
            <LineChart data={dados}>
              <defs>
                <linearGradient id="colorArticle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82AAC0" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#82AAC0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPatent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82AAC0" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#82AAC0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGuidance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82AAC0" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#82AAC0" stopOpacity={0} />
                </linearGradient>
              </defs>

              {chartKeys.map((key, index) => {
                const isVisible = visibleChart === index;
                const strokeColor = theme === 'dark' ? '#404040' : '#A3A3A3';

                const strokeOpacity = (chartKeys.length - index) / chartKeys.length;

                return !isVisible && (
                  <Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={strokeColor}
                    strokeWidth={6}
                    strokeOpacity={strokeOpacity}
                    dot={false}
                    isAnimationActive={false}
                  />
                );
              })}
            </LineChart>
          </ChartContainer>

          <ChartContainer config={chartConfig} className="h-[55vh] w-full top-[-55vh] relative">
            {chartKeys.map((key, index) => {
              if (visibleChart !== index) return null;

              const strokeColor = theme === 'dark' ? '#262626' : '#E5E5E5';
              const fillColor = `url(#color${key.split('_')[1][0].toUpperCase() + key.split('_')[1].slice(1)})`;

              return (
                <AreaChart key={key} data={dados} className="absolute top-0">
                  <Area
                    dataKey={key}
                    type="monotone"
                    stroke={'#559FB8'}
                    fill={fillColor}
                    strokeWidth={6}
                    dot={false}
                  />
                </AreaChart>
              );
            }).find((chart) => chart !== null) || <div />}
          </ChartContainer>

        </div>

        <div className="justify-center px-4 md:px-8 w-full mx-auto flex max-w-[1200px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20" >
          <Link to={'/informacoes'} className="inline-flex z-[2] items-center rounded-lg  bg-neutral-100 dark:bg-neutral-700  gap-2 mb-3 px-3 py-1 text-sm font-medium"><Info size={12} /><div className="h-full w-[1px] bg-neutral-200 dark:bg-neutral-800"></div>Saiba como utilizar a plataforma<ArrowRight size={12} /></Link>

          <h1 className="z-[2] text-center max-w-[980px] text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]  md:block mb-4 ">
            Busque por temas que são mais publicados no
            <strong className="bg-eng-blue ml-4 rounded-md px-3 pb-2 text-white font-medium">
              Cimatec!
            </strong>
            
          </h1>
          <p className="max-w-[750px] text-center text-lg font-light text-foreground"></p>

          <div className="lg:max-w-[60vw] lg:w-[60vw] w-full">
            <Search />
          </div>

          <div className="hidden md:flex flex-wrap gap-3 z-[2] w-full lg:w-[60vw]">

            {words.slice(0, 10).map((word, index) => (
              <div
                key={index}
                className={`flex gap-2 capitalize h-8 cursor-pointer transition-all bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-900 dark:bg-neutral-800 items-center p-2 px-3 rounded-md text-xs`}
                onClick={() => {
                  handlePesquisaChange(word.term)
                  onOpenResult('researchers-home')
                }}
              >
                {word.term}
              </div>
            ))}
          </div>

          <div className="flex md:hiddeen justify-center md:hidden flex-wrap gap-3 z-[3] w-full lg:hidden">
            {words.slice(0, 5).map((word, index) => (
              <div
                key={index}
                className={`flex gap-2 capitalize h-8 cursor-pointer transition-all bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-900 dark:bg-neutral-800 items-center p-2 px-3 rounded-md text-xs`}
                onClick={() => {
                  handlePesquisaChange(word.term)
                  onOpenResult('researchers-home')
                }}
              >
                {word.term}
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}
