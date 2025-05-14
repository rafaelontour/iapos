import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft, Component, SquareArrowOutUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useContext, useState } from "react";
import { UserContext } from "../../context/context";
import { Helmet } from "react-helmet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function ContentIndicators() {
  const history = useNavigate();

  const { version } = useContext(UserContext)

  const handleVoltar = () => {
    history(-1);
  }

  const url = 'https://app.powerbi.com/view?r=eyJrIjoiNTBjNmQ3NWQtODNmZC00MWZkLThjNWEtZjU5YmE2ZDkwMjVkIiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9'



  const [value, setValue] = useState('article')
  const url2 = 'https://app.powerbi.com/view?r=eyJrIjoiOTVmZjM2ZWUtMzliOS00Y2RkLTllYjItMmU3MDg4MjQxOTI5IiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9'

   const url3 = 'https://app.powerbi.com/view?r=eyJrIjoiNmU0MzhlYTAtZGVmZi00NTAxLThhN2UtOTU2NWJkMzNmZjA5IiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9'

   const getUrl = () => {
    if (value === "article") {
      return url;
    } else if (value === "2") {
      return url2;
    } else if (value === "3") {
      return url3;
    }
    return "#"; // Caso nenhuma condição seja atendida
  };
  
  return (
    <main className="flex h-full flex-1 flex-col gap-4  px-4 md:px-8 ">
      <Helmet>
        <title>Indicadores | Iapós</title>
        <meta name="description" content={`Indicadores | Iapos`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="flex items-center justify-between">
        <h1
          className="
            text-4xl mt-6 mb-2 font-bold
          "
        >
          Indicadores de produção</h1>
        <Link
          target="_blank"
          to={getUrl()}
        >
          <Button className="mt-2" size={'sm'}>
            <SquareArrowOutUpRight size={12} />
              Abrir em outra página
          </Button>
        </Link>
      </div>

      <div className="h-full pb-3">
        <iframe
          title="Report Section"
          className="w-full h-full rounded-md mb-8 border dark:border-neutral-800 "
          src={url}
        ></iframe>
      </div>

        

    </main>
  )
}