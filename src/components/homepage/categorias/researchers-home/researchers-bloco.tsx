import { useEffect, useRef, useState } from "react";
import { ResearchItem } from "./researcher-item";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Button } from "../../../ui/button";
import { Plus } from "phosphor-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "../../../dashboard/builder-page/tabelas/tabela-artigos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Research = {
  researcher: any[];
}

export function ResearchersBloco(props: Research) {

  const queryUrl = useQuery();
  const navigate = useNavigate();

  const initialPage = queryUrl.get('page') || '1';
  const initialLength = queryUrl.get('length') || '24';

  const [page, setPage] = useState(Number(initialPage));
  const [length, setLength] = useState(Number(initialLength));
  const location = useLocation();
  const [hasNavigated, setHasNavigated] = useState(false);

  const handleNavigate = (newPage: number, newLength: number, doScroll = true) => {
    queryUrl.set("page", newPage.toString());
    queryUrl.set("length", newLength.toString());
    navigate({
      pathname: location.pathname,
      search: queryUrl.toString(),
    });

    if (doScroll && hasNavigated && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setHasNavigated(true); // Marca que já navegou pelo menos uma vez
  };

  useEffect(() => {
    handleNavigate(page, length);
    setHasNavigated(true);
  }, [page, length]);

  const isFirstPage = page === 1;
  const isLastPage = props.researcher.length < length

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="pb-16" ref={containerRef}>
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 2,
          750: 3,
          900: 4,
          1200: 6,
          1500: 6,
          1700: 7
        }}
      >

        <Masonry gutter="16px">
          {props.researcher.map((item: any) => {

            return (
              <ResearchItem
                ufmg={item.ufmg}
                among={item.among}
                articles={item.articles}
                book={item.book}
                book_chapters={item.book_chapters}
                id={item.id}
                name={item.name}
                university={item.university}
                lattes_id={item.lattes_id}
                area={item.area}
                lattes_10_id={item.lattes_10_id}
                city={item.city}
                graduation={item.graduation}
                patent={item.patent}
                speaker={item.speaker}
                h_index={item.h_index}
                relevance_score={item.relevance_score}
                works_count={item.works_count}
                cited_by_count={item.cited_by_count}
                i10_index={item.i10_index}
                scopus={item.scopus}
                openalex={item.openalex}
                departament={item.departament}
                departments={item.departaments}
                subsidy={item.subsidy}
                status={item.status}
                graduate_programs={item.graduate_programs}
              />
            );
          })}
        </Masonry>
      </ResponsiveMasonry>

      {props.researcher.length == 0 && (
        <div className="items-center justify-center w-full flex text-center pt-6">Nenhum resultado encontrado</div>
      )}

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