import { useContext, useEffect, useState } from "react";
import { useModalSidebar } from "../../../hooks/use-modal-sidebar";
import { UserContext } from "../../../../context/context";
import { ArticleItem } from "./article-item";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { Button } from "../../../ui/button";
import { Plus } from "phosphor-react";
import { useQuery } from "../../../dashboard/builder-page/tabelas/tabela-artigos";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";

type Articles = {
    articles: any[];
    distinct: boolean
   
}


export function ArticleBlock(props:Articles) {
    const {navbar, isCollapsed} = useContext(UserContext)
     const queryUrl = useQuery();
     const navigate = useNavigate();

     const initialPage =  queryUrl.get('page') || '1';
     const initialLength =  queryUrl.get('length') || '12';
   
    const [page, setPage] = useState(Number(initialPage));
    const [length, setLength] = useState(Number(initialLength));
     const location = useLocation();
    const handleNavigate = (newPage: number, newLength: number) => {
    
      queryUrl.set("page", newPage.toString());
      queryUrl.set("length", newLength.toString());
      navigate({
        pathname: location.pathname,
        search: queryUrl.toString(),
      });
    };
  
    useEffect(() => {
      handleNavigate(page, length);
    }, [page, length]);

    const isFirstPage = page === 1;
    const isLastPage = props.articles.length < length



    const {isOpen} = useModalSidebar()

    const breakpoints = {
        350: 1,
        750: 2,
        900: 3,
        1200: 4,
        1700: 5
      };

    return(
       <div>
         <ResponsiveMasonry
   columnsCountBreakPoints={breakpoints}

    

>
                 <Masonry gutter="16px">
{props.articles.map((props: any) => {

        return (
            <ArticleItem
            id={props.id}
                    doi={props.doi}
                    name_periodical={props.name_periodical}
                    qualis={props.qualis}
                    title={props.title.toUpperCase()}
                    year={props.year}
                    color={props.color}
                    researcher={props.researcher}
                    lattes_id={props.lattes_id}
                    magazine={props.magazine}
                    lattes_10_id={props.lattes_10_id}
                    jcr_link={props.jcr_link}
                    jif={props.jif}
                    researcher_id={props.researcher_id}
                    distinct={props.distinct}
                    abstract={props.abstract}
                    article_institution={props.article_institution}
                    authors={props.authors}
                    authors_institution={props.authors_institution}
                    citations_count={props.citations_count}
                    issn={props.issn}
                    keywords={props.keywords}
                    landing_page_url={props.landing_page_url}
                    language={props.language}
                    pdf={props.pdf}
                    has_image={props.has_image}
                    relevance={props.relevance}
            />
        );
        })}
        </Masonry>
        </ResponsiveMasonry>

        <div className="w-full flex  justify-between items-center gap-4 mt-8">
     <div>

     </div>

      {/* Botões de navegação */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(prev => prev - 1)}
          disabled={isFirstPage}
        >
          <ChevronLeft size={16} className="mr-2" />
          Anterior
        </Button>

        <Button
          onClick={() => setPage(prev => prev + 1)}
          disabled={isLastPage}
        >
          Próximo
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </div>

       {/* Select de itens por página */}
       <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Itens por página:</span>
        <Select value={length.toString()} onValueChange={(value) => {
          setPage(1); // resetar para a primeira página
          setLength(parseInt(value));
        }}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Itens" />
          </SelectTrigger>
          <SelectContent>
            {[12, 24, 36, 48, 84, 162].map(val => (
              <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

       </div>
    )
}