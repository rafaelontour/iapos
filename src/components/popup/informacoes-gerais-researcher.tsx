import { CalendarBlank, ChalkboardSimple, ChartLine, Quotes } from "phosphor-react";
import dt from '../../assets/dt.png'
import pq from '../../assets/pq.png'
import fc from '../../assets/fc.png'



import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import { Building2, Clock, GraduationCap, Info, Mail, Phone, Shapes, SquareUser } from "lucide-react";
import { Alert } from "../ui/alert";
import { Link } from "react-router-dom";
import { useModal } from "../hooks/use-modal-store";
import { useContext } from "react";
import { UserContext } from "../../context/context";
import { Research } from "../modals/researcher-modal";


export function InformacoesGeraisResearcher(props: Research) {


  const qualisColor: { [key: string]: string } = {
    "ASTRONOMIA": "bg-red-200",
    "FÍSICA": "bg-blue-200",
    "GEOCIÊNCIAS": "bg-green-200",
    "MATEMÁTICA": "bg-yellow-200",
    "OCEANOGRAFIA": "bg-teal-200",
    "PROBABILIDADE E ESTATÍSTICA": "bg-purple-200",
    "QUÍMICA": "bg-orange-200",
    "AGRONOMIA": "bg-red-800",
    "CIÊNCIA E TECNOLOGIA DE ALIMENTOS": "bg-blue-800",
    "ENGENHARIA AGRÍCOLA": "bg-green-800",
    "MEDICINA VETERINÁRIA": "bg-yellow-800",
    "RECURSOS FLORESTAIS E ENGENHARIA FLORESTAL": "bg-teal-800",
    "RECURSOS PESQUEIROS E ENGENHARIA DE PESCA": "bg-purple-800",
    "ZOOTECNIA": "bg-orange-800",
    "BIOFÍSICA": "bg-red-600",
    "BIOLOGIA GERAL": "bg-blue-600",
    "BIOQUÍMICA": "bg-green-600",
    "BIOTECNOLOGIA": "bg-yellow-600",
    "BOTÂNICA": "bg-teal-600",
    "ECOLOGIA": "bg-purple-600",
    "FARMACOLOGIA": "bg-orange-600",
    "FISIOLOGIA": "bg-red-400",
    "GENÉTICA": "bg-blue-400",
    "IMUNOLOGIA": "bg-green-400",
    "MICROBIOLOGIA": "bg-yellow-400",
    "MORFOLOGIA": "bg-teal-400",
    "PARASITOLOGIA": "bg-purple-400",
    "ZOOLOGIA": "bg-orange-400",
    "EDUCAÇÃO FÍSICA": "bg-red-300",
    "ENFERMAGEM": "bg-blue-300",
    "FARMÁCIA": "bg-green-300",
    "FISIOTERAPIA E TERAPIA OCUPACIONAL": "bg-yellow-300",
    "FONOAUDIOLOGIA": "bg-teal-300",
    "MEDICINA": "bg-purple-300",
    "NUTRIÇÃO": "bg-orange-300",
    "ODONTOLOGIA": "bg-red-100",
    "SAÚDE COLETIVA": "bg-blue-100",
    "ANTROPOLOGIA": "bg-green-100",
    "ARQUEOLOGIA": "bg-yellow-100",
    "CIÊNCIA POLÍTICA": "bg-teal-100",
    "EDUCAÇÃO": "bg-purple-100",
    "FILOSOFIA": "bg-orange-100",
    "GEOGRAFIA": "bg-red-900",
    "HISTÓRIA": "bg-blue-900",
    "PSICOLOGIA": "bg-green-900",
    "SOCIOLOGIA": "bg-yellow-900",
    "TEOLOGIA": "bg-teal-900",
    "CIÊNCIA DA COMPUTAÇÃO": "bg-purple-900",
    "DESENHO INDUSTRIAL": "bg-orange-900",
    "ENGENHARIA AEROESPACIAL": "bg-red-500",
    "ENGENHARIA BIOMÉDICA": "bg-blue-500",
    "ENGENHARIA CIVIL": "bg-green-500",
    "ENGENHARIA DE ENERGIA": "bg-yellow-500",
    "ENGENHARIA DE MATERIAIS E METALÚRGICA": "bg-teal-500",
    "ENGENHARIA DE MINAS": "bg-purple-500",
    "ENGENHARIA DE PRODUÇÃO": "bg-orange-500",
    "ENGENHARIA DE TRANSPORTES": "bg-red-700",
    "ENGENHARIA ELÉTRICA": "bg-blue-700",
    "ENGENHARIA MECÂNICA": "bg-green-700",
    "ENGENHARIA NAVAL E OCEÂNICA": "bg-yellow-700",
    "ENGENHARIA NUCLEAR": "bg-teal-700",
    "ENGENHARIA QUÍMICA": "bg-purple-700",
    "ENGENHARIA SANITÁRIA": "bg-orange-700",
    "ARTES": "bg-red-50",
    "LETRAS": "bg-blue-50",
    "LINGÜÍSTICA": "bg-green-50",
    "BIOÉTICA": "bg-yellow-50",
    "CIÊNCIAS AMBIENTAIS": "bg-teal-50",
    "DEFESA": "bg-purple-50",
    "DIVULGAÇÃO CIENTÍFICA": "bg-orange-50",
    "MICROELETRÔNICA": "bg-red-700",
    "ROBÓTICA, MECATRÔNICA E AUTOMAÇÃO": "bg-blue-700",
    "SEGURANÇA CONTRA INCÊNDIO": "bg-green-700",
    "ADMINISTRAÇÃO": "bg-yellow-700",
    "ARQUITETURA E URBANISMO": "bg-teal-700",
    "CIÊNCIA DA INFORMAÇÃO": "bg-purple-700",
    "COMUNICAÇÃO": "bg-orange-700",
    "DEMOGRAFIA": "bg-red-100",
    "DIREITO": "bg-blue-100",
    "ECONOMIA": "bg-green-100",
    "ECONOMIA DOMÉSTICA": "bg-yellow-100",
    "MUSEOLOGIA": "bg-teal-100",
    "PLANEJAMENTO URBANO E REGIONAL": "bg-purple-100",
    "SERVIÇO SOCIAL": "bg-orange-100",
    "TURISMO": "bg-red-200",
  };

  const normalizeArea = (area: string): string => {
    return area

      .toUpperCase(); // Converte para maiúsculas
  };

  const classificationColors = {
    "A+": "bg-green-500",
    A: "bg-green-400",
    "B+": "bg-yellow-400",
    B: "bg-yellow-300",
    "C+": "bg-orange-400",
    C: "bg-orange-300",
    "D+": "bg-red-400",
    D: "bg-red-300",
    "E+": "bg-gray-400",
    E: "bg-gray-300",
  };

  const { onClose } = useModal()

  const currentDate = new Date();
  const lattesUpdate = String(props.lattes_update).split('/');
  const lattesMonth = parseInt(lattesUpdate[1]);
  const lattesYear = parseInt(lattesUpdate[2]);

  const monthDifference = (currentDate.getFullYear() - lattesYear) * 12 + (currentDate.getMonth() + 1 - lattesMonth);

  const isOutdated = monthDifference > 3;
  const isOutdated6 = monthDifference > 6;

  const { version } = useContext(UserContext)

  const hasAnyInfo = (
    (props.h_index != '') ||
    (props.cited_by_count != '') ||
    (props.i10_index != '') ||
    (props.classification != '' && !version)
  );

  return (
    <div className="h-fit text-left w-full">

      {hasAnyInfo && (
        <>
          <div className=" font-medium text-2xl mb-6 pr-12">Informações gerais</div>

          <div className="flex gap-3 mb-6 items-center flex-wrap">
            {props.h_index?.length != 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="outline-none"><div className=" py-2 px-4 border border-neutral-200 bg-white dark:bg-black dark:border-neutral-800  rounded-md text-xs flex gap-2 items-center"><ChartLine size={12} className="textwhite" /> índice H no OpenAlex: {props.h_index}</div></TooltipTrigger>
                  <TooltipContent>
                    <p>Dados do OpenAlex</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            )}

            {props.cited_by_count?.length != 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="outline-none"> <div className=" border-neutral-200 border dark:border-neutral-800 bg-white dark:bg-black py-2 px-4  rounded-md text-xs  flex gap-2 items-center"><Quotes size={12} className="textwhite" /> Citações: {props.cited_by_count}</div></TooltipTrigger>
                  <TooltipContent>
                    <p>Dados do OpenAlex</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            )}

            {props.i10_index?.length != 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="outline-none"> <div className=" py-2 px-4 border  border-neutral-200 bg-white dark:bg-black dark:border-neutral-800 rounded-md text-xs  flex gap-2 items-center"><ChartLine size={12} className="textwhite" />índice i10: {props.i10_index}</div></TooltipTrigger>
                  <TooltipContent>
                    <p>Dados do OpenAlex</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            )}

            {!version && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="outline-none">
                    <Link target="_blank" to={`/indice-pesquisador`} onClick={() => onClose()} className="flex gap-0">
                      <div className=" py-2 px-4 border border-neutral-200 bg-eng-blue text-white dark:bg-eng-blue dark:border-neutral-800  rounded-l-md text-xs flex gap-2 items-center"><ChartLine size={12} className="textwhite" /> índice do pesquisador: </div>
                      <div
                        className={`py-2 px-4 border border-neutral-200 border-l-0 text-white dark:border-neutral-800 rounded-r-md text-xs flex gap-2 items-center ${classificationColors[props.classification] || "bg-neutral-200"
                          }`}
                      >
                        {props.classification}</div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Saiba mais</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>)}

            <div
              className={`
     py-2 px-4 border  border-neutral-200 bg-white dark:bg-black dark:border-neutral-800 rounded-md text-xs  flex gap-2 items-center

      lg:hidden

    ${isOutdated6 ? ('bg-red-500 text-white border-none') : isOutdated ? ('bg-yellow-600 text-white border-none') : ('')}
  `}
            >
              <CalendarBlank size={12} /> Atualização do Lattes: {String(props.lattes_update)}
            </div>

          </div>
        </>
      )}

      {props.departments && props.departments.length != 0 && (

        props.departments.slice(0, 1).map((item) => (
          <div>
            <div className="font-medium text-left text-2xl mb-6 pr-12">
              Departamento
            </div>
            <Link to={`/departamentos?dep_id=${item.dep_id}`}
              target="_blank">
              <div className="flex mb-6 w-full relative">

                <div className={`w-2 min-w-[8px] min-h-[125px] relative bg-[#719CB8]  flex flex-1  rounded-l-lg border border-r-0 border-neutral-200 dark:border-neutral-800 `}></div>

                <Alert className="flex justify-center  rounded-l-none gap-6 ">
                  <div className="flex flex-col flex-1 justify-center  h-full">

                    <p className="mb-2 font-medium">{item.dep_sigla} - {item.dep_nom}</p>

                    <div className="line-clamp-2 flex-wrap text-xs text-muted-foreground flex gap-4">

                      <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Mail size={12} />{item.dep_email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Phone size={12} />{item.dep_tel}</div>
                    </div>
                  </div>


                </Alert>
              </div></Link>
          </div>
        ))

      )}

      {props.subsidy.length != 0 && (

        props.subsidy.slice(0, 1).map((item) => (
          <div>
            <div className="font-medium text-left text-2xl mb-6 pr-12">
              Bolsa CNPq
            </div>
            <div className="flex relative flex-1 mb-6">

              <div className={`w-2 min-w-[8px] min-h-[125px] flex flex-1 relative rounded-l-lg ${item.modality_code == 'DT' ? ('bg-[#183EFF]') : ('bg-[#00D000]')} border border-r-0 border-neutral-200 dark:border-neutral-800 `}></div>

              <Alert className="flex justify-center  rounded-l-none gap-8 ">
                <div className="flex flex-col flex-1 justify-center h-full">
                  <p className="mb-2 font-medium">{item.modality_name} - Nível {item.category_level_code}</p>

                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    {item.call_title}
                  </div>
                </div>

                {props.subsidy.slice(0, 1).map((item) => (
                  <img src={item.modality_code == 'PQ' ? (pq) : (dt)} className="w-8 relative -top-4 h-[52px]" alt="" />
                ))}
              </Alert>
            </div>
          </div>
        ))

      )}

      {props.graduate_programs.length !== 0 && (
        <div >
          <div className="font-medium text-2xl mb-6 ">
            Programas de pós-graduação
          </div>

          <div className="flex gap-3 items-center mb-6 flex-wrap">
            {props.graduate_programs.map((item) => (
              <Link
                key={item.graduate_program_id}
                to={`/pos-graduacao?graduate_program_id=${item.graduate_program_id}`}
                target="_blank"
                className="w-full"
              >
                <Alert className="flex justify-center gap-6 ">
                  <div className="flex flex-col flex-1 justify-center h-full">
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 justify-between">
                      PROGRAMA DE PÓS-GRADUAÇÃO
                      <GraduationCap size={14} />
                    </div>
                    <p className="font-medium">{item.name}</p>


                  </div>
                </Alert>

              </Link>

            ))}
          </div>
        </div>
      )}


      {props.research_groups?.length != 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="font-medium text-2xl ">
              Grupos de pequisa
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger> <Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent>
                  <p>Líder ou vice-líder de grupos cadastrados no DGP CNPq</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col mb-6 gap-6">
            {props.research_groups.map((item) => (
              <Link to={`/grupos-pesquisa?group_id=${item.group_id}`} target="_blank" className="w-full">

                <div className="flex ">

                  <div className={`w-2 min-w-2 rounded-l-md dark:border-neutral-800 border  border-neutral-200 border-r-0 ${qualisColor[normalizeArea(item.area || '')]} min-h-full relative`}></div>

                  <Alert className="flex justify-center  rounded-l-none gap-6 ">
                    <div className="flex flex-col flex-1 justify-center h-full">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 justify-between">
                        {item.area}

                        <Shapes size={14} />
                      </div>
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </Alert>
                </div>
              </Link>
            ))}
          </div>
        </div>

      )}

    </div>
  )
}