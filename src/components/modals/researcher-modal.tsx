import { useModal } from "../hooks/use-modal-store";

import {
  Drawer,

  DrawerContent,

  DrawerFooter,
  DrawerHeader,
  DrawerPortal,

} from "../../components/ui/drawer"
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";

import { InformationResearcher } from "../popup/information-researcher";
import { useContext } from "react";
import { UserContext } from "../../context/context";


export type Research = {
  among: number,
  articles: number,
  institution_id: string
  book: number,
  book_chapters: number,
  id: string,
  cargo: string,
  clas: string,
  classe: string,
  rt: string,
  situacao: string,
  data_atualizacao_lattes: string,

  name: string,
  university: string,
  lattes_id: string,
  area: string,
  lattes_10_id: string,
  abstract: string,
  city: string,
  orcid: string,
  image: string
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
  ind_prod: string
  h_index: string,
  relevance_score: string,
  works_count: string,
  cited_by_count: string,
  i10_index: string,
  scopus: string,
  openalex: string,
  classification: string
  subsidy: Bolsistas[]
  graduate_programs: GraduatePrograms[]
  departments: Departments[]
  research_groups: ResearchGroups[]
  status: boolean

  abstract_ai: string
}

interface Bolsistas {
  aid_quantity: string
  call_title: string
  funding_program_name: string
  modality_code: string
  category_level_code: string
  institute_name: string
  modality_name: string
  scholarship_quantity: string
}

interface GraduatePrograms {
  graduate_program_id: string
  name: string
}

interface Departments {
  dep_des: string
  dep_email: string
  dep_nom: string
  dep_id: string
  dep_sigla: string
  dep_site: string
  dep_tel: string
  img_data: string
}

interface ResearchGroups {
  area: string
  group_id: string
  name: string
}


import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArrowSquareOut, BracketsCurly, Buildings, CalendarBlank, CaretDown, File, FileCsv, Files, Quotes, ShareNetwork, Stamp, Student, Ticket, UserRectangle, X } from "phosphor-react";
import { NuvemPalavras } from "../popup/nuvem-palavras";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TotalViewResearcher } from "../popup/total-view-researcher";
import { InformacoesGeraisResearcher } from "../popup/informacoes-gerais-researcher";
import { ArticlesResearcherPopUp } from "../popup/articles-researcher";
import { BooksResearcherPopUp } from "../popup/book-researcher";
import { ProducaoTecnicaResearcherPopUp } from "../popup/producao-tecnica-researcher";
import { OrientacoesResearcherPopUp } from "../popup/orientacoes-researcher";
import { RelatorioTecnicoResearcherPopUp } from "../popup/relatorio-tecnico-researcher";
import { SpeakerResearcherPopUp } from "../popup/speaker-researcher";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BookOpen, BookOpenText, Boxes, Briefcase, Check, Copy, Download, FolderKanban, LoaderCircle, Minus, MoreHorizontal, Plus, Waypoints } from "lucide-react";
import html2pdf from 'html2pdf.js';

import QRCode from "react-qr-code";

type ResearchOpenAlex = {
  h_index: number;
  relevance_score: number;
  works_count: number;
  cited_by_count: number;
  i10_index: number;
  scopus: string;
  orcid: string
  openalex: string

}
import { toast } from "sonner"
import { Link } from "react-router-dom";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ResearchProject } from "../popup/research-project";
import { WorkEvent } from "../popup/trabalho-evento";
import { TextoRevista } from "../popup/texto-revista";
import { CargosFuncoes } from "../popup/cargos-funcoes";
import { Coautores } from "../popup/coautores";
import { getInstitutionImage } from "../homepage/categorias/institutions-home/institution-image";
import { Ufmg } from "../homepage/categorias/researchers-home/researcher-item";

export function ResearcherModal() {

  const { onClose, isOpen, type: typeModal, data } = useModal();
  const isModalOpen = isOpen && typeModal === "researcher-modal";
  const [researcher, setResearcher] = useState<Research[]>([]);
  const [, isLoading] = useState(false)
  const { name } = data
  const { urlGeral, itemsSelecionados, setItensSelecionadosPopUp, searchType, valoresSelecionadosExport, setPesquisadoresSelecionados, pesquisadoresSelecionados, permission } = useContext(UserContext);


  const [, setResearcherData] = useState<ResearchOpenAlex[]>([]);

  // Função para lidar com a atualização de researcherData
  const handleResearcherUpdate = (newResearcherData: ResearchOpenAlex[]) => {
    setResearcherData(newResearcherData);
  };


  let urlTermPesquisadores = ''

  if (typeModal === "researcher-modal") {
    urlTermPesquisadores = urlGeral + `researcherName?name=${name != null && (name.split(' ').join(';'))}`;
  }

  console.log(urlTermPesquisadores)

  useMemo(() => {
    setItensSelecionadosPopUp(itemsSelecionados)
  }, [itemsSelecionados]);

  const [open, setOpen] = useState(false);
  const variations = useMemo(() => {
    if (!name) return [];
    return generateNameVariations(name || '');
  }, [name]);

  useEffect(() => {
    if (!isOpen) {
      setOpen(false);
    }
    setItensSelecionadosPopUp(itemsSelecionados);
  }, [isOpen, itemsSelecionados]);

  const [loadingMessage, setLoadingMessage] = useState("Estamos procurando todas as informações do(a) pesquisador(a) no nosso banco de dados, aguarde.");

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    if (isOpen) {
      setLoadingMessage("Estamos procurando todas as informações do(a) pesquisador(a) no nosso banco de dados, aguarde.");

      timeouts.push(setTimeout(() => {
        setLoadingMessage("Estamos quase lá, continue aguardando...");
      }, 5000));

      timeouts.push(setTimeout(() => {
        setLoadingMessage("Só mais um pouco...");
      }, 10000));

      timeouts.push(setTimeout(() => {
        setLoadingMessage("Está demorando mais que o normal... estamos tentando encontrar tudo.");
      }, 15000));

      timeouts.push(setTimeout(() => {
        setLoadingMessage("Estamos empenhados em achar todos os dados, aguarde só mais um pouco");
      }, 15000));
    }

    return () => {
      // Limpa os timeouts ao desmontar ou quando isOpen mudar
      timeouts.forEach(clearTimeout);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return; // Evita requisição quando modal está fechado

      try {
        isLoading(true)
        const response = await fetch(urlTermPesquisadores, {
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
          setResearcher(data);
        }
        if (data.length === 0 && isOpen) {
          onClose();
          toast("Pesquisador(a) ainda não carregado na base", {
            description: "Tente novamente mais tarde",
            action: {
              label: "Fechar",
              onClick: () => console.log("Undo"),
            },
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        isLoading(false);
      }
    };
    fetchData();
  }, [urlTermPesquisadores, isOpen]);

  const [value, setValue] = useState('articles')

  const currentTabValue = useMemo(() => {
    if (searchType === 'article' || searchType === 'name' || searchType === 'abstract' || searchType === 'area') {
      return 'article';
    } else if (searchType === 'book') {
      return 'book';
    } else if (searchType === 'patent' || searchType === 'patente') {
      return 'producao-tecnica';
    } else if (searchType === 'speaker') {
      return 'speaker';
    }
    return 'articles'; // valor padrão
  }, [searchType]);

  useEffect(() => {
    if (!isOpen) return;
    setValue(currentTabValue);
  }, [isOpen, currentTabValue]);

  /////

  //csv
  const [jsonData, setJsonData] = useState<any[]>([]);

  let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${valoresSelecionadosExport}&researcher_id=${(researcher.map((props) => (props.id)))}&type=ARTICLE&qualis=&qualis=&year=1900`;


  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await fetch(urlPublicacoesPorPesquisador, {
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
          setJsonData(data)
        }
      } catch (err) {
        console.log(err);
      } finally {

      }
    };
    fetchData();
  }, [urlPublicacoesPorPesquisador]);

  const hasBaremaAvaliacao = permission.some(
    (perm) => perm.permission === 'criar_barema_avaliacao'
  );

  const convertJsonToCsv = (json: any[]): string => {
    const items = json;
    const replacer = (_: string, value: any) => (value === null ? '' : value); // Handle null values
    const header = Object.keys(items[0]);
    const csv = [
      '\uFEFF' + header.join(';'), // Add BOM and CSV header
      ...items.map((item) =>
        header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
      ) // CSV data
    ].join('\r\n');

    return csv;
  };

  const handleDownloadJson = async () => {
    try {
      const csvData = convertJsonToCsv(jsonData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `dados.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadSituationReport = async () => {
    const primary = researcher[0];
    if (!primary?.id) return;
    const toastId = toast.loading("Gerando relatório de situação...");
    try {
      const url = `${urlGeral}researcher/situation-report?researcher_id=${primary.id}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Erro ao buscar dados do relatório");
      const data = await resp.json();

      const quadrienal: string = data.quadrienal ?? '';
      const resData = data.researcher ?? {};
      const guidances: any[] = data.active_guidances ?? [];
      const articles: any[] = data.quadrienal_articles ?? [];
      const summary: any[] = data.quadrienal_summary ?? [];

      const summaryByType: Record<string, number> = {};
      summary.forEach((s: any) => {
        summaryByType[s.type] = (summaryByType[s.type] || 0) + Number(s.total);
      });

      const guidancesByType: Record<string, any[]> = {};
      guidances.forEach((g: any) => {
        const key = g.type || 'OUTROS';
        if (!guidancesByType[key]) guidancesByType[key] = [];
        guidancesByType[key].push(g);
      });

      const gps: any[] = resData.graduate_programs ?? [];
      const gpList = gps.map((g: any) =>
        `${g.acronym ?? g.name} — ${g.modality ?? ''} (${g.type ?? ''})`
      ).join('<br>');

      const guidanceRows = Object.entries(guidancesByType).map(([tipo, items]) => `
        <tr style="background:#f0f4ff;">
          <td colspan="4" style="padding:8px 12px;font-weight:700;font-size:13px;color:#1e3a8a;">
            ${tipo} (${items.length} orientação${items.length !== 1 ? 'ões' : ''})
          </td>
        </tr>
        ${items.map(g => `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:6px 12px;font-size:12px;">${g.student_name ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;color:#6b7280;">${g.title ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;text-align:center;">${g.year ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;text-align:center;">
            <span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">Em Andamento</span>
          </td>
        </tr>`).join('')}`
      ).join('');

      const articleRows = articles.slice(0, 30).map(a => `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:6px 12px;font-size:12px;">${a.title ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;color:#6b7280;white-space:nowrap;">${a.journal ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;text-align:center;font-weight:700;color:#1e3a8a;">${a.qualis ?? 'SQ'}</td>
          <td style="padding:6px 12px;font-size:12px;text-align:center;">${a.year ?? '—'}</td>
        </tr>`
      ).join('');

      const summaryHtml = Object.entries(summaryByType).map(([tipo, total]) => `
        <div style="display:inline-block;margin:4px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:8px 16px;text-align:center;">
          <div style="font-size:20px;font-weight:700;color:#1e3a8a;">${total}</div>
          <div style="font-size:11px;color:#6b7280;">${tipo}</div>
        </div>`
      ).join('');

      const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

      const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;color:#111827;">
        <div style="background:#1e3a8a;color:#fff;padding:24px 32px;border-radius:8px 8px 0 0;">
          <div style="font-size:11px;letter-spacing:1px;color:#93c5fd;text-transform:uppercase;margin-bottom:4px;">iaPós · SENAI CIMATEC</div>
          <h1 style="margin:0 0 4px 0;font-size:20px;font-weight:700;">Relatório de Situação do Pesquisador</h1>
          <div style="font-size:13px;color:#bfdbfe;">Emitido em ${now} · Quadriênio ${quadrienal}</div>
        </div>

        <div style="border:1px solid #e5e7eb;border-top:none;padding:20px 32px;background:#f8fafc;">
          <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#1f2937;">${resData.name ?? ''}</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;color:#4b5563;">
            <div><strong>Formação:</strong> ${resData.graduation ?? '—'}</div>
            <div><strong>Instituição:</strong> ${resData.institution ?? '—'}</div>
            <div><strong>Área:</strong> ${resData.area ?? '—'}</div>
            <div><strong>Lattes ID:</strong> ${resData.lattes_id ?? '—'}</div>
            ${resData.h_index ? `<div><strong>H-Index:</strong> ${resData.h_index}</div>` : ''}
            ${resData.orcid ? `<div><strong>ORCID:</strong> ${resData.orcid}</div>` : ''}
          </div>
          ${gpList ? `<div style="margin-top:12px;font-size:13px;color:#4b5563;"><strong>Programas de Pós-Graduação:</strong><br>${gpList}</div>` : ''}
        </div>

        <div style="padding:20px 32px;border:1px solid #e5e7eb;border-top:none;">
          <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:700;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;">
            Produção no Quadriênio ${quadrienal}
          </h3>
          <div style="margin-bottom:16px;">${summaryHtml || '<span style="color:#9ca3af;font-size:13px;">Nenhuma produção registrada neste quadriênio.</span>'}</div>

          ${articles.length > 0 ? `
          <div style="margin-top:16px;">
            <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;">Artigos em Periódicos (${articles.length})</div>
            <table style="width:100%;border-collapse:collapse;font-size:12px;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Título</th>
                  <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Periódico</th>
                  <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;">Qualis</th>
                  <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;">Ano</th>
                </tr>
              </thead>
              <tbody>${articleRows}</tbody>
            </table>
            ${articles.length > 30 ? `<div style="font-size:11px;color:#9ca3af;margin-top:8px;">* Exibindo os 30 primeiros artigos de ${articles.length} no quadriênio.</div>` : ''}
          </div>` : ''}
        </div>

        <div style="padding:20px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
          <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:700;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;">
            Orientações Ativas — Apenas Itens em Andamento
          </h3>
          ${guidances.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Orientando</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Título</th>
                <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Ano</th>
                <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Status</th>
              </tr>
            </thead>
            <tbody>${guidanceRows}</tbody>
          </table>` : `
          <div style="color:#9ca3af;font-size:13px;">Nenhuma orientação ativa encontrada.</div>`}
        </div>

        <div style="margin-top:12px;font-size:11px;color:#9ca3af;text-align:center;">
          Documento gerado automaticamente pela plataforma iaPós · ${now}
        </div>
      </div>`;

      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);

      await html2pdf().set({
        margin: [8, 10, 8, 10],
        filename: `Relatorio_Situacao_${resData.name?.replace(/\s+/g, '_') ?? 'pesquisador'}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(container).save();

      document.body.removeChild(container);
      toast.dismiss(toastId);
      toast.success("Relatório gerado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Erro ao gerar relatório de situação");
    }
  };



  const currentUrl = window.location.origin

  function generateNameVariations(name: string): string[] {
    const parts = name.toUpperCase().split(' ');
    const lastName = parts[parts.length - 1];
    const initials = parts.map(part => part[0]).join('. ');
    const initialsWithDots = initials.replace(/ /g, '.');
    const firstAndMiddleNames = parts.slice(0, -1).join(' ');
    const penultimatePart = parts.length >= 2 ? parts[parts.length - 2] : '';

    const variations = [
      `${lastName}, ${initials}`,
      `${capitalize(lastName)}, ${initials}`,
      `${capitalize(lastName)}, ${initialsWithDots}`,
      `${capitalize(lastName)}, ${capitalize(firstAndMiddleNames)} ${initials}`,
      `${lastName}, ${firstAndMiddleNames.charAt(0)}`,
      `${capitalize(lastName)}, ${capitalize(firstAndMiddleNames)}`,
      `${lastName}, ${firstAndMiddleNames}`,
      `${lastName}, ${capitalize(firstAndMiddleNames)} ${initialsWithDots}`,
      `${penultimatePart} ${lastName}, ${firstAndMiddleNames}`,
      `${lastName}, ${initials.charAt(0)}`,
      `${lastName}, ${name.toUpperCase()}`,
      `${lastName}, ${capitalize(firstAndMiddleNames)} ${initials}`,
      `${initials.charAt(0)}. ${capitalize(lastName)}, ${initials}`,
      `${initialsWithDots} ${capitalize(lastName)}`,
      `${initialsWithDots} ${lastName}`
    ];

    return variations;
  }

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const url = await getInstitutionImage(researcher[0].institution_id);
      setImageUrl(url);
    };

    fetchImage();
  }, [researcher]);


  return (
    <>
      <Drawer open={isModalOpen} onClose={onClose}   >

        <DrawerContent onInteractOutside={onClose} className={`max-h-[88%] pt-6 border border-b-0`} >
          {researcher.length === 0 && (
            <div className="flex justify-center items-center h-[80vh]">
              <div className="w-full flex flex-col items-center justify-center h-full">
                <div className="text-eng-blue mb-4 animate-pulse">
                  <LoaderCircle size={108} className="animate-spin" />
                </div>
                <p className="font-medium text-lg max-w-[500px] text-center">
                  {loadingMessage}
                </p>
              </div>
            </div>
          )}

          {researcher.slice(0, 1).map((user) => {
            return (
              <div className="w-full flex justify-center ">
                <div className="bg-cover bg-center bg-no-repeat h-28 w-28 bg-white dark:bg-neutral-950   rounded-2xl mb-3 border-4 border-white dark:border-neutral-950  absolute top-[-55px]   " style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${user.id}) ` }}></div>
              </div>
            )
          })}

          {researcher.slice(0, 1).map((props) => {
            let urlShare = `${currentUrl}/researcher?researcher_name=${props.name}&search_type=${searchType}&terms=${valoresSelecionadosExport}`
            if (searchType == 'name') {
              urlShare = `${currentUrl}/researcher?researcher_name=${props.name}&search_type=${searchType}&terms=`
            }

            const payment = props.lattes_id

            const currentDate = new Date();
            const lattesUpdate = String(props.lattes_update).split('/');
            const lattesMonth = parseInt(lattesUpdate[1]);
            const lattesYear = parseInt(lattesUpdate[2]);

            const monthDifference = (currentDate.getFullYear() - lattesYear) * 12 + (currentDate.getMonth() + 1 - lattesMonth);

            const isOutdated = monthDifference > 3;
            const isOutdated6 = monthDifference > 6;



            return (
              <div
                className="
                  px-2

                  md:px-10 md:pb-2 md:pt-6

                  lg:px-16 
                "
              >
                <div className="flex justify-between items-center w-full">

                  <div className="flex gap-3 items-center">
                    <div
                      className={`
                      hidden text-[0.5rem] py-2 px-4 border dark:border-neutral-800 w-fit
                      text-gray-400 rounded-md  font-bold gap-1 items-center

                      md:text-xs md:py-2 md:px-4 

                      lg:flex

                      ${isOutdated6 ? ('bg-red-500 text-white border-none') : isOutdated ? ('bg-yellow-600 text-white border-none') : ('')}
                  `}
                    >
                      <CalendarBlank size={16} />  Atualização do Lattes: {String(props.lattes_update)}
                    </div>
                    {researcher.slice(0, 1).map((user) => {

                      if (!user.status) {
                        return (
                          <div
                            className={`
                        hidden text-[0.5rem] py-2 px-4 border dark:border-neutral-800 w-fit
                        rounded-md  font-bold gap-1 items-center
  
                        md:text-xs md:py-2 md:px-4 
  
                        lg:flex
                        text-white border-none
                        ${user.status ? ('bg-green-500 ') : ('bg-red-500')}
                    `}
                          >
                            {user.status ? (<Check size={16} />) : (<Minus size={16} />)} {user.status ? ('Ativo') : ('Inativo')}
                          </div>
                        )
                      }

                    })}
                  </div>

                  <div className="hidden lg:flex gap-3">

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={'default'}
                            onClick={() => {
                              // Verifica se o pesquisador já está selecionado pelo nome
                              if (pesquisadoresSelecionados.some(pesquisador => pesquisador.name === props.name)) {
                                // Remove o pesquisador selecionado com o nome correspondente
                                setPesquisadoresSelecionados(prev => prev.filter(pesquisador => pesquisador.name !== props.name));

                                toast("Pesquisador(a) removido dos selecionados", {
                                  description: `${props.name}`,
                                  action: {
                                    label: "Fechar",
                                    onClick: () => console.log("Fechar"),
                                  },
                                });
                              } else {
                                // Adiciona o novo pesquisador selecionado
                                setPesquisadoresSelecionados(prev => [
                                  ...prev,
                                  {
                                    id: props.id,
                                    name: props.name,
                                    university: props.university,
                                    lattes_id: props.lattes_id,
                                    city: props.city,
                                    area: props.area,
                                    graduation: props.graduation,
                                  }
                                ]);

                                toast("Pesquisador(a) adicionado aos selecionados", {
                                  description: `${props.name}`,
                                  action: {
                                    label: "Fechar",
                                    onClick: () => console.log("Fechar"),
                                  },
                                });
                              }
                            }}
                            className={`
                                h-8 w-8 p-0 text-white dark:text-white 
                                ${pesquisadoresSelecionados.some(pesquisador => pesquisador.name === props.name) && 'bg-red-500 hover:bg-red-600 text-white'}
                              `}
                          >
                            {pesquisadoresSelecionados.some(pesquisador => pesquisador.name === props.name) ? (
                              <X size={16} className="" />
                            ) : (
                              <Plus size={16} className="" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent> {pesquisadoresSelecionados.some(pesquisador => pesquisador.name === props.name) ? (
                          'Remover pesquisador(a) do barema'
                        ) : (
                          'Adicionar pesquisador(a) ao barema'
                        )}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>



                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={urlShare} target="_blank">
                            <Button variant={'default'} className="h-8 w-8 p-0 text-white dark:text-white">
                              <span className="sr-only">Open menu</span>
                              <ArrowSquareOut size={8} className="h-4 w-4" />
                            </Button></Link>
                        </TooltipTrigger>
                        <TooltipContent>Ir a página</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant={'default'} onClick={() => onClose()} className="h-8 w-8 p-0 text-white dark:text-white">
                            <span className="sr-only">Open menu</span>
                            <CaretDown size={8} className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Fechar</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem className="flex items-center gap-3"
                          onClick={() => {
                            navigator.clipboard.writeText(payment)
                            toast("Operação realizada", {
                              description: "Lattes ID copiado para área de transferência",
                              action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                              },
                            })
                          }}
                        ><Copy className="h-4 w-4" />
                          Copiar Lattes ID
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-3" onClick={() => handleDownloadJson()}><FileCsv className="h-4 w-4" />CSV dos artigos</DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-3" onClick={() => handleDownloadSituationReport()}><Download className="h-4 w-4" />Relatório de Situação (PDF)</DropdownMenuItem>

                        <Link to={`${urlGeral}dictionary.pdf`}>
                          <DropdownMenuItem className="flex items-center gap-3" ><File className="h-4 w-4" />Dicionário de dados</DropdownMenuItem></Link>

                        <DropdownMenuItem className="flex items-center gap-3" onClick={() => setOpen(!open)} ><BracketsCurly className="h-4 w-4" />API da consulta</DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-3"
                          onClick={() => {
                            navigator.clipboard.writeText(urlShare)
                            toast("Operação realizada", {
                              description: "Link copiado para área de transferência",
                              action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                              },
                            })
                          }}
                        ><ShareNetwork className="h-4 w-4" />
                          Copiar link para compartilhar

                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex justify-center py-4">
                          <QRCode size={200} className={'bg-transparent'} value={urlShare} />
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div
                  className="
                    flex items-center flex-col relative mt-14

                    md:mt-3
                  "
                >
                  <h4 className="text-3xl font-medium px-8 text-center mb-2">{props.name}</h4>
                  <div className="flex text-gray-500 items-center gap-2 mb-2">
                    {!imageUrl ? (
                      <Buildings size={16} className="" />
                    ) : (
                      <img src={imageUrl} alt="" className="h-6" />
                    )}
                    <p className="text-md  ">{props.university}</p>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="overflow-y-auto elementBarra">
            <div
              className="
                px-7 w-full
                md:px-10

                lg:px-16
              "
            >
              <DrawerHeader className="p-0 flex flex-col">
                {researcher.slice(0, 1).map((user) => {
                  return (
                    <div>
                      <InformationResearcher
                        atualizacao_lattes={user.lattes_update.toString()}
                        {...user}
                        onResearcherUpdate={handleResearcherUpdate}

                        openAPI={open}
                      />
                    </div>
                  )
                })}

                <div className="flex gap-6 xl:flex-row flex-col-reverse">
                  <div className="flex w-full flex-1">
                    <Tabs defaultValue="articles" value={value} className="w-[99%]">
                      {researcher.slice(0, 1).map(() => (
                        <div className=" grid grid-cols-1  w-full">
                          <ScrollArea className="mb-4">
                            <TabsList className="mb-4 flex h-auto">
                              <TabsTrigger
                                value="article"
                                onClick={() => setValue('article')}
                                className="flex gap-2 items-center"
                              >
                                <File size={16} className="" />
                                Artigos
                              </TabsTrigger>
                              <TabsTrigger
                                value="book"
                                onClick={() => setValue('book')}
                                className="flex gap-2 items-center"
                              >
                                <BookOpen size={16} className="" />
                                Livros e capítulos
                              </TabsTrigger>
                              <TabsTrigger
                                value="producao-tecnica"
                                onClick={() => setValue('producao-tecnica')}
                                className="flex gap-2 items-center"
                              >
                                <Stamp size={16} className="" />
                                Produção técnica
                              </TabsTrigger>
                              <TabsTrigger
                                value="relatorio-tecnico"
                                onClick={() => setValue('relatorio-tecnico')}
                                className="flex gap-2 items-center"
                              >
                                <Files size={16} className="" />
                                Relatório técnico
                              </TabsTrigger>
                              <TabsTrigger
                                value="orientacoes"
                                onClick={() => setValue('orientacoes')}
                                className="flex gap-2 items-center"
                              >
                                <Student size={16} className="" />
                                Orientações
                              </TabsTrigger>
                              <TabsTrigger
                                value="speaker"
                                onClick={() => setValue('speaker')}
                                className="flex gap-2 items-center"
                              >
                                <Ticket size={16} className="" />
                                Participação em eventos
                              </TabsTrigger>
                              <TabsTrigger
                                value="research-project"
                                onClick={() => setValue('research-project')}
                                className="flex gap-2 items-center"
                              >
                                <FolderKanban size={16} className="" />
                                Projetos de pesquisa
                              </TabsTrigger>

                              <TabsTrigger
                                value="texto-revista"
                                onClick={() => setValue('texto-revista')}
                                className="flex gap-2 items-center"
                              >
                                <BookOpenText size={16} className="" />
                                Texto em revista ou jornal
                              </TabsTrigger>

                              <TabsTrigger
                                value="trabalho-evento"
                                onClick={() => setValue('trabalho-evento')}
                                className="flex gap-2 items-center"
                              >
                                <Briefcase size={16} className="" />
                                Trabalhos em evento
                              </TabsTrigger>

                              <TabsTrigger
                                value="cargos"
                                onClick={() => setValue('cargos')}
                                className="flex gap-2 items-center"
                              >
                                <Waypoints size={16} className="" />
                                Atuação profissional
                              </TabsTrigger>

                            </TabsList>

                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      ))}
                      <TabsContent value="article">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <ArticlesResearcherPopUp name={String(user.id)} />
                          )
                        })}
                      </TabsContent>
                      <TabsContent value="book">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <BooksResearcherPopUp name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="producao-tecnica">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <ProducaoTecnicaResearcherPopUp name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="relatorio-tecnico">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <RelatorioTecnicoResearcherPopUp name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="orientacoes">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <OrientacoesResearcherPopUp name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="speaker">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <SpeakerResearcherPopUp name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="research-project">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <ResearchProject name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="texto-revista">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <TextoRevista name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="trabalho-evento">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <WorkEvent name={String(user.id)} />
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="cargos">
                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <CargosFuncoes name={String(user.id)} />
                          )
                        })}
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="xl:w-[350px] w-full grid grid-cols-1 ">
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        350: 1,
                        750: 1,
                        900: 1,
                        1200: 1
                      }}
                    >
                      <Masonry gutter="1px">
                        {researcher.slice(0, 1).map((user) => {

                          return (
                            <InformacoesGeraisResearcher
                              {...user}
                            />
                          )

                        })}

                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <TotalViewResearcher
                              among={user.among}
                              articles={user.articles}
                              book={user.book}
                              book_chapters={user.book_chapters}
                              patent={user.patent}
                              software={user.software}
                              brand={user.brand}
                            />
                          )
                        })}

                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <NuvemPalavras
                              id={user.id}
                            />
                          )
                        })}

                        {researcher.slice(0, 1).map((user) => {
                          return (
                            <Coautores
                              id={user.id}
                              name={user.name}
                            />
                          )
                        })}


                        {researcher.slice(0, 1).map(() => {
                          return (
                            <div>
                              <div className=" text-left mb-6 font-medium text-2xl">Nomes de citação</div>
                              <div className="flex flex-wrap gap-1">
                                {variations.map((variation, index) => (
                                  <p className="text-xs " key={index}>{variation} /</p>
                                ))}
                              </div>
                            </div>
                          )
                        })}

                      </Masonry>
                    </ResponsiveMasonry>
                  </div>
                </div>
              </DrawerHeader>

              <DrawerFooter>

              </DrawerFooter>
            </div>
          </div>

        </DrawerContent>

      </Drawer>
    </>
  )
}