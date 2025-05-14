import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { Button } from "../ui/button";
import { useQuery } from "../dashboard/builder-page/tabelas/tabela-artigos";
import { UserContext } from "../../context/context";
import { ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet";

export function CriarBarema() {
        //firebase submit
    
        const history = useNavigate();
    
        const handleVoltar = () => {
            history(-1);
        }
    
        const [tab, setTab] = useState('all')
    
        const { version } = useContext(UserContext)
    
        const queryUrl = useQuery();
        const type_search = queryUrl.get('barema_id');
      
        let baremaSelecionado = type_search || ''

    return(
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
        <Helmet>
        <title>Baremas | Módulo administrativo | Iapos </title>
        <meta name="description" content={`Baremas | Módulo administrativo | Iapos`} />
        <meta name="robots" content="index, follow" />
    </Helmet>
                <div className="w-full  gap-4">
                    <div className="flex items-center gap-4">

                        <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Voltar</span>
                        </Button>

                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Baremas de avaliação
                        </h1>

                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        
                           
                        </div>
                    </div>
                </div>

              
               

          
        </main>
    )
}