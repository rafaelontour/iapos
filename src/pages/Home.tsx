
import { useContext, useEffect } from "react";
import SearchLayout from "../layout/search-layout";
import { UserContext } from "../context/context";
import { GeralProvider } from "../components/provider/geral-provider";
import { useModalHomepage } from "../components/hooks/use-modal-homepage";
import { useLocation, useParams } from "react-router-dom";



export function Home() {
    const { onOpen } = useModalHomepage();
    const {navCollapsedSize, defaultLayout, isCollapsed, idGraduateProgram,  setValoresSelecionadosExport} = useContext(UserContext)

  

    const location = useLocation();
    const { searchId } = useParams<{
      searchId: string
  }>();

  

  useEffect(() => {
    if (searchId) {
        setValoresSelecionadosExport(searchId);
        console.log('setValoresSelecionadosExport', searchId);
    }
}, [searchId]);

     

    useEffect(() => {
      if(location.pathname == '/') {
      onOpen('initial-home')
  } else  if(location.pathname == `/resultados`) {
    onOpen('result-home')
} else if(location.pathname == '/pos-graduacao') {
    onOpen('graduation-home')
} else if(location.pathname == '/mapa-palavras') {
    onOpen('dicionario')
}  else if(location.pathname == '/indicadores') {
    onOpen('indicadores')
} else if(location.pathname == '/producoes-recentes') {
    onOpen('producoes-recentes')
} else if(location.pathname == '/grupos-pesquisa') {
    onOpen('grupos-pesquisa')
} else if(location.pathname == '/departamentos') {
    onOpen('departamentos')
} else if(location.pathname == '/researcher') {
    onOpen('pesquisador')
} else if(location.pathname == '/resultados-ia') {
    onOpen('maria')
} else if(location.pathname == '/listagens') {
    onOpen('docentes-tecnicos')
} else if(location.pathname == '/paines-dados-externos') {
    onOpen('paines-dados-externos')
}  else if(location.pathname == '/provimento-cargo') {
    onOpen('provimento-cargo')
} 
    }, [location]);
  
console.log(idGraduateProgram)



    return(
        <>
        <SearchLayout
         defaultLayout={defaultLayout}
         defaultCollapsed={isCollapsed}
         navCollapsedSize={navCollapsedSize}
        >
            <GeralProvider/>

        </SearchLayout>
        </>
    )
}