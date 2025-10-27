import { AlertCircle, ChevronsUpDown, Info, Maximize2, Plus, RefreshCcw, User, UserIcon, X } from "lucide-react";
import { Button } from "../../ui/button";

import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { MagnifyingGlass, Trash } from "phosphor-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/context";
import { useModal } from "../../hooks/use-modal-store";

import { Alert } from "../../ui/alert";

import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { v4 as uuidv4 } from 'uuid';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import CartaoOrientando from "./CartaoOrientando";
import { Separator } from "../../ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";
import { getDiscentesPorPrograma } from "../../../service/discentes";
import { adicionarOrientacao, getDocentesPorPrograma, getOrientacoesPorDocente } from "../../../service/docentes";
import { Configuracao } from "../dados-pos-graduacao/dados-pos-graduacao";
import { getConfiguracoes } from "../../../service/configuracaoDataPosGraduacao";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Tag } from "../dados-pos-graduacao/Tags";
import { getTagsService } from "../../../service/tags";



export interface PesquisadorProps {
  lattes_id: string
  researcher_id: string
  name: string
  type_: string
  graduate_program_id: string
  years: Array<number>
}

interface Participacao {
  graduate_program_id: string,
  researcher_id: string,
  year: string,
  type_: string
  tag: string | null
}

export interface PesquisadorProps2 {
  name: string
  lattes_id: string
  researcher_id: string
  institution_id: string
}

interface Props {
  graduate_program_id: string
}


export function DocentesGraduate(props: Props) {
  const [type, setType] = useState('COLABORADOR');
  const { urlGeralAdm, user, urlGeral } = useContext(UserContext);
  const [input, setInput] = useState('')
  const { onOpen, isOpen, type: typeModal, data: dataModal } = useModal();
  const [researcher, setResearcher] = useState<PesquisadorProps[]>([]);


  // Rafael

  const [contColaboradores, setContColaboradores] = useState(0);
  const [contPermanentes, setContPermanentes] = useState(0);

  // Final Rafael

  const urlGetResearcher = `${urlGeralAdm}GraduateProgramResearcherRest/Query?graduate_program_id=${props.graduate_program_id}`;

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Função para buscar todos os pesquisadores de um programa de pós-graduação.
   * 
   * @returns {Promise<void>} - Uma promessa que resolve com o estado de sucesso ou falha.
   */
  /*******  8453ee06-4689-4b24-84d9-e9ad9f9156a2  *******/
  const fetchDataAll = async () => {
    try {
      const response = await fetch(urlGetResearcher, {
        mode: "cors",
        method: 'GET',
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
        // Certifique-se de que cada researcher tenha o graduate_program_id correto
        const researchersWithGraduateProgramId = data.map((researcher: PesquisadorProps) => ({
          ...researcher,
          graduate_program_id: props.graduate_program_id,
        }));

        setResearcher(researchersWithGraduateProgramId);

        // Cria uma nova lista ordenando a participation de cada pesquisador
        const researchersOrdenados = researchersWithGraduateProgramId.map((r) => ({
          ...r,
          participation: [...r.participation].sort((a, b) => b.year - a.year) // do maior para o menor
        }));

        // Usa a posição 0 para contar
        const colaboradores = researchersOrdenados.filter(
          (r: any) => r.participation[0]?.type_ === "COLABORADOR"
        ).length;

        const permanentes = researchersOrdenados.filter(
          (r: any) => r.participation[0]?.type_ === "PERMANENTE"
        ).length;

        setContColaboradores(colaboradores);
        setContPermanentes(permanentes);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchDataAll()
  }, [urlGeralAdm, props.graduate_program_id]);

  useEffect(() => {
    if (typeModal === 'confirm-delete-researcher-graduate-program' && !isOpen) {
      fetchDataAll()
    }

    fetchDataAll()
  }, [isOpen, typeModal]);

  const permanenteCount = researcher.filter(researcher => researcher.type_ === 'PERMANENTE').length;
  const colaboradorCount = researcher.filter(researcher => researcher.type_ === 'COLABORADOR').length;


  //listar todos os pesquisadores popover
  const [pesquisadoreSelecionado, setPesquisadorSelecionado] = useState<PesquisadorProps2 | undefined>();


  const [researcherSearch, setResearcherSearch] = useState<PesquisadorProps2[]>([]);

  const urlGetResearcherSearch = urlGeralAdm + `ResearcherRest/Query?institution_id=&name=&count= `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlGetResearcherSearch, {
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
          setResearcherSearch(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();


  }, [urlGetResearcherSearch, props.graduate_program_id]);

  const [openPopo2, setOpenPopo2] = useState(false)

  const normalizeString = (str: any) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const filteredList = researcherSearch.filter(r => !researcher.some(p => p.researcher_id === r.researcher_id)).filter((r) =>
    normalizeString(r.name).includes(normalizeString(input))
  );

  const handleSubmit = async (idPrograma: string, idPesquisador: string) => {

    const existe = researcher.some((r: any) => r.lattes_id === idPesquisador && r.graduate_program_id === idPrograma);

    if (existe) {
      const urlDelete = urlGeral + "GraduateProgramResearcherRest/Delete"
      const resposta = await fetch(urlDelete, {
        mode: 'cors',
        method: 'DELETE',
        body: JSON.stringify([
          {
            graduate_program_id: idPrograma,
            lattes_id: idPesquisador
          }
        ])
      })

      if (!resposta.ok) {
        toast.error("Tente novamente", { description: "Falha ao remover os registros antigos do pesquisador." })
        return
      }
    }


    let urlProgram = urlGeralAdm + 'GraduateProgramResearcherRest/Insert'
    try {

      const dadosEnvio: Participacao[] = []

      anosComoColaborador.forEach((ano) => {
        const dado: Participacao = {
          graduate_program_id: idPrograma,
          researcher_id: idPesquisador,
          year: ano.ano,
          type_: "COLABORADOR",
          tag: null,
        }
        dadosEnvio.push(dado)
      })

      anosComoPermanente.forEach((ano) => {
        const dado: Participacao = {
          graduate_program_id: idPrograma,
          researcher_id: idPesquisador,
          year: ano.ano,
          type_: "PERMANENTE",
          tag: null,
        }
        dadosEnvio.push(dado)
      })

      const fetchData = async () => {

        try {
          const response = await fetch(urlProgram, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '3600',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEnvio),
          });

          if (response.ok) {

            toast("Dados enviados com sucesso", {
              description: "Pesquisador adicionado no programa de pós-graduação",
              action: {
                label: "Fechar",
                onClick: () => console.log("Undo"),
              },
            })

            fetchDataAll()
            setPesquisadorSelecionado(undefined);
            setAnosComoColaborador([]);
            setAnosComoPermanente([]);

          } else {
            toast("Tente novamente!", {
              description: "Erro ao cadastrar pesquisador ao programa",
              action: {
                label: "Fechar",
                onClick: () => console.log("Undo"),
              },
            })
          }

        } catch (err) {
          console.log(err);
        }
      };
      fetchData();



    } catch (error) {
      toast("Erro ao processar requisição", {
        description: "Tente novamente!",
        action: {
          label: "Fechar",
          onClick: () => console.log("Undo"),
        },
      })
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - (3 - i)); // Ordenando os anos em ordem crescente

  // Crie estados para os tipos e anos selecionados para cada pesquisador
  const [types, setTypes] = useState(researcher.map((props) => props.type_));
  const [selectedYears, setSelectedYears] = useState(
    researcher.map((props) => props.years ?? []) // Garantir um array vazio caso 'props.years' seja undefined
  )

  useEffect(() => {

    setTypes(researcher.map((props) => props.type_))
    setSelectedYears(researcher.map((props) => props.years))

  }, [researcher]);

  const [nomePesquisador, setNomePesquisador] = useState('');
  const [lattesID, setLattesID] = useState('');

  const handleSubmitPesquisador = async (idPrograma: string, idPesquisador: string) => {

    let urlDelete = urlGeralAdm + '/GraduateProgramResearcherRest/Delete'
    const resposta = await fetch(urlDelete, {
      mode: 'cors',
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([
        {
          graduate_program_id: idPrograma,
          lattes_id: idPesquisador
        }
      ])
    })

    if (resposta.status !== 204) {
      toast.error("Tente novamente", { description: "Falha ao remover os registros antigos do pesquisador." })
      return
    }

    const dadosEnvio: Participacao[] = []

    anosComoColaborador.forEach((ano) => {
      const dado: Participacao = {
        graduate_program_id: idPrograma,
        researcher_id: idPesquisador,
        year: ano.ano,
        type_: "COLABORADOR",
        tag: null,
      }
      dadosEnvio.push(dado)
    })

    anosComoPermanente.forEach((ano) => {
      const dado: Participacao = {
        graduate_program_id: idPrograma,
        researcher_id: idPesquisador,
        year: ano.ano,
        type_: "PERMANENTE",
        tag: null,
      }
      dadosEnvio.push(dado)
    })

    const atualizarParticipacao = async () => {

      let urlProgram = urlGeralAdm + '/GraduateProgramResearcherRest/Insert'

      const resposta = await fetch(urlProgram, {
        mode: 'cors',
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosEnvio),
      })

      if (!resposta.ok) {
        toast.error("Erro ao atualizar dados")
        return
      }

      toast.success("Dados atualizados com sucesso")

      fetchDataAll()
    }

    atualizarParticipacao()
  }

  const [tab, setTab] = useState('all')

  const [input2, setInput2] = useState('')

  const filteredTotal: any = Array.isArray(researcher) ? researcher.filter(item => {
    // Normaliza a string do item e da busca para comparação
    const normalizeString = (str: any) => str
      .normalize("NFD") // Decompõe os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos
      .toLowerCase(); // Converte para minúsculas

    const searchString = normalizeString(item.name);
    const normalizedSearch = normalizeString(input2);

    return searchString.includes(normalizedSearch);
  }) : [];

  // Rafael
  const [configDatas, setConfigDatas] = useState<Configuracao[]>([])
  const [configDataSelecionada, setConfigDataSelecionada] = useState<Configuracao | null>(null)

  const [tipoOrientacao, setTipoOrientacao] = useState<any>(null)
  const [orientacoes, setOrientacoes] = useState<any>([])

  const [idOrientador, setIdOrientador] = useState<string | null>(null)
  const [idOrientando, setIdOrientando] = useState<string | null>(null)
  const [idCoorientador, setIdCoorientador] = useState<string | null>(null)

  const [dataEntrada, setDataEntrada] = useState<string | null>(null)
  const [dataPrevisaoDefesa, setDataPrevisaoDefesa] = useState<string | null>(null)
  const [dataRealizadaDefesa, setDataRealizadaDefesa] = useState<string | null>(null)

  const [dataPrevisaoQualificacao, setDataPrevisaoQualificacao] = useState<string | null>(null)
  const [dataRealizadaQualificacao, setDataRealizadaQualificacao] = useState<string | null>(null)

  const [dataPrevisaoDefesaFinal, setDataPrevisaoDefesaFinal] = useState<string | null>(null)
  const [dataRealizadaDefesaFinal, setDataRealizadaDefesaFinal] = useState<string | null>(null)

  const [discentesPosGraduacao, setDiscentesPosGraduacao] = useState<any[]>([])
  const [docentesPosGraduacao, setDocentesPosGraduacao] = useState<any[]>([])

  const [openDialogAdicionar, setOpenDialogAdicionar] = useState<boolean>(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<Tag[]>([]);

  useEffect(() => {
    if (dataEntrada !== null) {
      gerarDatas();
    }
  }, [configDatas])

  useEffect(() => {
    buscarDatas();
  }, [configDataSelecionada])

  function buscarDatas() {
    const datas = getConfiguracoes();

    datas.then((response) => {
      setConfigDatas(response)
    })
  }

  async function buscarTags() {
    const t = await getTagsService();
    setTags(t);
  }

  function buscarDiscentes() {
    const discentes = getDiscentesPorPrograma(props.graduate_program_id);

    discentes.then((response) => {
      setDiscentesPosGraduacao(response)
    })
  }

  useEffect(() => {
    infoPrograma();
    buscarDiscentes();
    buscarTags();
    const docentes = getDocentesPorPrograma(props.graduate_program_id);

    docentes.then((response) => {
      setDocentesPosGraduacao(response)
    })
  }, [])

  function gerarDatas(): void {

    const [anoStr, mesStr, diaStr] = (dataEntrada || "").split("-");
    const ano = parseInt(anoStr);
    const mes = parseInt(mesStr) - 1;
    const dia = parseInt(diaStr);

    const data = new Date(ano, mes, dia);
    let mesesAdicionais: number;


    // Definindo data de previsão da defesa do projeto
    data.setMonth(data.getMonth() + (configDataSelecionada && configDataSelecionada?.duration_project_months || 0));
    data.setDate(dia);

    const novoAno = data.getFullYear();
    const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");

    const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;
    setDataPrevisaoDefesa(dataFormadaPrevisao);


    // Definindo data de previsão da qualificação
    data.setMonth(data.getMonth() +
      (configDataSelecionada && configDataSelecionada?.duration_qualification_months || 0));
    data.setDate(dia);

    const novoAno2 = data.getFullYear();
    const novoMesPrevisao2 = String(data.getMonth() + 1).padStart(2, "0");

    const dataFormadaPrevisao2 = `${novoAno2}-${novoMesPrevisao2}-${diaStr}`;

    setDataPrevisaoQualificacao(dataFormadaPrevisao2);


    // Definindo data de previsão da defesa final

    data.setMonth(data.getMonth() +
      (configDataSelecionada && configDataSelecionada?.duration_conclusion_months || 0));
    data.setDate(dia);

    const novoAno3 = data.getFullYear();
    const novoMesPrevisao3 = String(data.getMonth() + 1).padStart(2, "0");

    const dataFormadaPrevisao3 = `${novoAno3}-${novoMesPrevisao3}-${diaStr}`;

    setDataPrevisaoDefesaFinal(dataFormadaPrevisao3);
  }

  async function buscarOrientacoesPorDocente(idDocente: string, idPrograma: string) {
    const o = await getOrientacoesPorDocente(idDocente, idPrograma);

    console.log("Orientacoes: ", o)

    setOrientacoes(o)
  }


  async function salvarOrientando(evento: any) {
    evento.preventDefault();
    if (dataEntrada == null || idOrientador == null || idOrientando == null || dataPrevisaoDefesa == null || dataPrevisaoQualificacao == null || dataPrevisaoDefesaFinal == null || idCoorientador == null) {
      alert("Preencha todos os campos!\n\nDados OBRIGATÓRIOS:\n- Orientando\n- Data de Entrada\n- Configuração de data");
      return
    }

    const orientacao = {
      start_date: dataEntrada,
      planned_date_project: dataPrevisaoDefesa,
      done_date_project: dataRealizadaDefesa,
      graduate_program_id: props.graduate_program_id,
      planned_date_qualification: dataPrevisaoQualificacao,
      done_date_qualification: dataRealizadaQualificacao,
      planned_date_conclusion: dataPrevisaoDefesaFinal,
      done_date_conclusion: dataRealizadaDefesaFinal,
      supervisor_researcher_id: idOrientador,
      student_researcher_id: idOrientando,
      co_supervisor_ids: [idCoorientador],
      tag_ids: tagsSelecionadas.map(tag => tag.id)
    }

    console.log("Orientaçao para salvar: ", orientacao)

    const response = await adicionarOrientacao(orientacao)

    if (response.status === 201) {
      buscarOrientacoesPorDocente(idOrientador, props.graduate_program_id);
      limparCampos();
      toast.success("Orientação adicionada com sucesso!");
    } else {
      toast.error("Não foi possível adicionar a orientação!");
    }
  }

  function limparCampos() {
    setIdOrientando(null)
    setIdOrientador(null)
    setIdCoorientador(null)
    setOpenDialogAdicionar(false)
    setDataEntrada(null)
    setDataPrevisaoDefesa(null)
    setDataRealizadaDefesa(null)
    setDataPrevisaoQualificacao(null)
    setDataRealizadaQualificacao(null)
    setDataPrevisaoDefesaFinal(null)
    setDataRealizadaDefesaFinal(null)
    setConfigDataSelecionada(null)
    setTagsSelecionadas([])
  }

  const infoPrograma = async () => {
    const token = localStorage.getItem('jwt_token');
    const resposta = await fetch(`${urlGeralAdm}GraduateProgramRest/Query?graduate_program_id=${props.graduate_program_id}`, {
      mode: "cors",
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600",
        "Content-Type": "text/plain",
      },
    });

    const data = await resposta.json();
    setTipoOrientacao(data[0].type);
  }

  // Parte de colaborador e permanente

  const [anosComoPermanente, setAnosComoPermanente] = useState<{ tipo: string, ano: string }[]>([]);
  const [anosComoColaborador, setAnosComoColaborador] = useState<{ tipo: string, ano: string }[]>([]);

  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: anoAtual - 2016 + 1 }, (_, i) => anoAtual - i);

  function adicionarAnoComoColaborador(ano: string) {

    const existe = anosComoColaborador.some(a => a.tipo === 'COLABORADOR' && a.ano === ano);

    if (anosComoPermanente.some(a => a.tipo === 'PERMANENTE' && a.ano === ano)) {
      toast.warning("Não é permitido ter a mesma participação no mesmo ano!", { description: "Caso queira substituir, desmarque o ano como PERMANTENTE." });
      return
    }

    if (existe) {
      // remove o que for igual
      setAnosComoColaborador(anosComoColaborador.filter(a => !(a.tipo === 'COLABORADOR' && a.ano === ano)));
    } else {
      // adiciona se não existir
      setAnosComoColaborador([...anosComoColaborador, { tipo: 'COLABORADOR', ano }]);
    }
  }

  function adicionarAnoComoPermanente(ano: string) {
    const existe = anosComoPermanente.some(a => a.tipo === 'PERMANENTE' && a.ano === ano);

    if (anosComoColaborador.some(a => a.tipo === 'COLABORADOR' && a.ano === ano)) {
      toast.warning("Não é permitido ter a mesma participação no mesmo ano!", { description: "Caso queira substituir, desmarque o ano como COLABORADOR." });
      return
    }

    if (existe) {
      // remove o que for igual
      setAnosComoPermanente(anosComoPermanente.filter(a => !(a.tipo === 'PERMANENTE' && a.ano === ano)));
    } else {
      // adiciona se não existir
      setAnosComoPermanente([...anosComoPermanente, { tipo: 'PERMANENTE', ano }]);
    }
  }

  function preencherDatasParticipacao(pesquisador: any) {
    if (!pesquisador || !Array.isArray(pesquisador.participation)) return;

    const colaboradores: { tipo: string; ano: string }[] = [];
    const permanentes: { tipo: string; ano: string }[] = [];

    for (const p of pesquisador.participation) {
      // ignora years nulos/undefined
      if (p.year == null) continue;

      const anoStr = String(p.year);

      if (p.type_ === "COLABORADOR") {
        colaboradores.push({ tipo: "COLABORADOR", ano: anoStr });
      } else if (p.type_ === "PERMANENTE") {
        permanentes.push({ tipo: "PERMANENTE", ano: anoStr });
      }
    }

    // remover duplicatas (por ano) caso necessário
    const dedupe = (arr: { tipo: string; ano: string }[]) =>
      Array.from(
        new Map(arr.map((item) => [item.ano, item])).values()
      );

    setAnosComoColaborador(dedupe(colaboradores));
    setAnosComoPermanente(dedupe(permanentes));
  }

  return (
    <div>
      <div>
        <CardContent className="flex flex-col justify-between p-8 pt-0 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ">
            <Alert className="p-0 mb-4 md:mb-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Docentes permenentes
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{contPermanentes}</div>
                <p className="text-xs text-muted-foreground">
                  registrados
                </p>
              </CardContent>
            </Alert>

            <Alert className="p-0 mb-4 md:mb-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Docentes colaboradores
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contColaboradores}</div>
                <p className="text-xs text-muted-foreground">
                  registrados
                </p>
              </CardContent>
            </Alert>
          </div>


          <Tabs value={tab} defaultValue={tab}>
            <Alert className="p-0">
              <CardHeader className="flex flex-row items-start bg-neutral-100 rounded-t-md dark:bg-neutral-800">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="group flex items-center w-fit gap-2 text-lg">
                    <div className="w-fit">Docentes</div>
                  </CardTitle>
                  <div className="flex gap-3 items-center ">
                    <TabsList>
                      <TabsTrigger value="all" onClick={() => setTab('all')}>Docentes da instituição</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="mt-6">
                <TabsContent value="all">
                  <div className="gap-6 flex items-end">
                    <div className="flex flex-col gap-2 space-y-1.5 w-full flex-1">
                      <Label htmlFor="name" className="text-lg">Pesquisador da instituição</Label>
                      <p className="text-sm">Selecione um pesquisador para adicionar seus anos de participação</p>

                      <Dialog open={openPopo2} onOpenChange={setOpenPopo2}>
                        <DialogTrigger className="w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPopo2}
                            className="w-full justify-between"
                          >
                            {pesquisadoreSelecionado
                              ? researcherSearch.find((framework) => framework.name === pesquisadoreSelecionado.name)?.name
                              : 'Selecione um pesquisador'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className=" " >
                          <DialogHeader>
                            <DialogTitle>Escolher pesquisador</DialogTitle>
                            <DialogDescription>
                              Todos os docentes cadastrado no Módulo Administrativo da instituição
                            </DialogDescription>
                          </DialogHeader>

                          <div className="border rounded-md bg-white dark:bg-neutral-950 px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
                            <MagnifyingGlass size={16} />
                            <Input
                              className="border-0"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Buscar docente"
                            />
                          </div>

                          <div className={'max-h-[350px] overflow-y-auto elementBarra'}>

                            <div className="flex flex-col gap-1 p-2">
                              {filteredList.length > 0 ? (
                                filteredList.map((props, index) => (
                                  <Button
                                    variant={'ghost'}
                                    key={index}
                                    className="text-left justify-start"
                                    onClick={() => {
                                      setPesquisadorSelecionado(props);
                                      setOpenPopo2(false); // Fechar o popover após a seleção
                                    }}
                                  >
                                    {props.name}
                                  </Button>
                                ))
                              ) : (
                                <div className="text-center w-full text-sm">Nenhum pesquisador encontrado</div>
                              )}
                            </div>
                          </div>
                        </DialogContent>

                      </Dialog>
                    </div>

                  </div>

                  {
                    pesquisadoreSelecionado && (
                      <div className="flex flex-col gap-4 w-full mt-4 bg-zinc-300 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-200 p-5 rounded-md">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[22px]">Anos de participação</p>
                          <span title="Fechar" className="bg-red-500 rounded-md p-2 hover:cursor-pointer">
                            <X color="white" size={19} onClick={() => { setAnosComoColaborador([]); setAnosComoPermanente([]); setPesquisadorSelecionado(undefined); }} />
                          </span>
                        </div>

                        <div className="flex items-stretch gap-2 w-fit -mt-1 rounded-md border bg-white border-gray-300 relative overflow-hidden">
                          <span className="flex justify-center items-center text-white w-20 bg-eng-blue self-stretch">
                            <AlertCircle size={20} />
                          </span>

                          <p className="p-2 text-md dark:text-black">
                            Marque os anos nos quais o pesquisador participou como COLABORADOR ou PERMANENTE. Após completar, clique em <strong>salvar participação</strong> para enviar os dados.
                            O ano estará selecionado quando o fundo do botão mudar de cor. Clique novamente para remover o ano.
                          </p>
                        </div>

                        <div className="flex flex-col w-full gap-4 border border-gray-300 p-5 rounded-md">
                          <div className="flex flex-col gap-3 mb-1">
                            <p className="text-[17px]">Anos de participação de <span className="text-eng-dark-blue">{pesquisadoreSelecionado.name.split(' ')[0]}</span> como <span className="text-green-700">COLABORADOR</span></p>

                            <div className="flex items-center gap-2">
                              {
                                anos.map((ano, index) => (
                                  <div
                                    key={index}
                                    className={`
                                        border border-gray-300 flex items-center
                                        px-3 py-1 rounded-md hover:cursor-pointer
                                        ${anosComoColaborador.some(a => a.ano === ano.toString()) ? 'bg-green-700 text-white' : 'bg-white text-black'}
                                      `}
                                    onClick={() => adicionarAnoComoColaborador(ano.toString())}
                                  >
                                    {ano}
                                  </div>
                                ))
                              }
                            </div>
                          </div>

                          <hr />

                          <div className="flex flex-col gap-3">
                            <p className="text-[17px]">Anos de participação de <span className="text-eng-dark-blue">{pesquisadoreSelecionado.name.split(' ')[0]}</span> como <span className="text-blue-700">PERMANENTE</span></p>

                            <div className="flex items-center gap-2">
                              {
                                anos.map((ano, index) => (
                                  <div
                                    key={index}
                                    className={`
                                        border border-gray-300 flex items-center
                                        px-3 py-1 rounded-md hover:cursor-pointer
                                        ${anosComoPermanente.some(a => a.ano === ano.toString()) ? 'bg-blue-700 text-white' : 'bg-white text-black'}
                                      `}
                                    onClick={() => adicionarAnoComoPermanente(ano.toString())}
                                  >
                                    {ano}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            if (pesquisadoreSelecionado) handleSubmit(props.graduate_program_id, pesquisadoreSelecionado?.researcher_id)
                          }}
                        >
                          <Plus size={16} />Salvar Participação
                        </Button>
                      </div>
                    )
                  }
                </TabsContent>
              </CardContent>
            </Alert>
          </Tabs>

        </CardContent>

        <div className="px-8 pb-8">
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-4"
          >
            <div className="border bg-white dark:bg-neutral-950  rounded-md px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
              <MagnifyingGlass size={16} />
              <Input
                className="border-0"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Buscar pesquisador"
              />
            </div>

            {filteredTotal.map((props, index) => (
              <Alert key={index}>
                <AccordionItem value={String(index)}>
                  <div className="flex justify-between items-center h-10 group">
                    <div className="h-10">
                      <div className="flex items-center gap-2">
                        <Avatar className="cursor-pointer rounded-md h-8 w-8">
                          <AvatarImage
                            className="rounded-md h-8 w-8"
                            src={`${urlGeral}ResearcherData/Image?name=${props.name}`}
                          />
                          <AvatarFallback className="flex items-center justify-center">
                            <UserIcon size={12} />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{props.name}</p>
                          <div className="text-xs text-gray-500">{props.lattes_id}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className=" items-center gap-3 hidden group-hover:flex transition-all">
                        <Button size={'icon'} onClick={() => onOpen('researcher-modal', { name: props.name })} variant={'ghost'} className="h-10 w-10 ">
                          <Maximize2 size={16} />
                        </Button>

                        <Button
                          size={'icon'}
                          onClick={() => {
                            dataModal.graduate_program_id = props.graduate_program_id
                            dataModal.researcher_id = props.researcher_id
                            onOpen('confirm-delete-researcher-graduate-program', {
                              researcher_id: props.researcher_id, graduate_program_id: props.graduate_program_id
                            })
                          }}
                          variant={'destructive'}
                          className=" text-white h-10 w-10 dark:text-white"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>

                      <AccordionTrigger
                        onClick={() => {
                          buscarOrientacoesPorDocente(props.researcher_id, props.graduate_program_id)
                          setAnosComoColaborador([]);
                          setAnosComoPermanente([]);
                          const pesquisadorAccordion = researcher.find((pesquisa) => pesquisa.researcher_id === props.researcher_id);
                          preencherDatasParticipacao(pesquisadorAccordion);
                        }}
                      ></AccordionTrigger>
                    </div>
                  </div>

                  <AccordionContent className="p-0">
                    <div className="flex flex-col w-full gap-4 mt-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col gap-4 w-full">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[22px]">Anos de participação</p>
                            <Button
                              onClick={() => handleSubmitPesquisador(props.graduate_program_id, props.researcher_id)}
                            >
                              <RefreshCcw size={16} /> Atualizar dados
                            </Button>
                          </div>


                          <div className="flex items-center gap-2 w-fit -mt-1 rounded-md border border-gray-300 overflow-hidden">
                            <span className="flex justify-center items-center text-white h-full w-10 bg-eng-blue">
                              <AlertCircle size={17} />
                            </span>
                            <p className="p-2 pr-3 text-md">
                              Marque os anos nos quais o pesquisador participou como COLABORADOR ou PERMANENTE. Após completar, clique em <strong>atualizar dados</strong> para salvar as alterações.
                              <br />
                              O ano estará selecionado quando o fundo do botão mudar de cor. Clique novamente para remover o ano.
                            </p>
                          </div>

                          <div className="flex flex-col w-full gap-4 border border-gray-300 p-5 rounded-md">
                            <div className="flex flex-col gap-3 mb-1">
                              <p className="text-[17px]">Anos de participação de <span className="text-eng-dark-blue">{props.name.split(' ')[0]}</span> como <span className="text-green-700">COLABORADOR</span></p>

                              <div className="flex items-center gap-2">
                                {
                                  anos.map((ano, index) => (
                                    <div
                                      key={index}
                                      className={`
                                        border border-gray-300 flex items-center
                                        px-3 py-1 rounded-md hover:cursor-pointer
                                        ${anosComoColaborador.some(a => a.ano === ano.toString()) ? 'bg-green-700 text-white' : 'bg-white text-black'}
                                      `}
                                      onClick={() => adicionarAnoComoColaborador(ano.toString())}
                                    >
                                      {ano}
                                    </div>
                                  ))
                                }
                              </div>
                            </div>

                            <hr />

                            <div className="flex flex-col gap-3">
                              <p className="text-[17px]">Anos de participação de <span className="text-eng-dark-blue">{props.name.split(' ')[0]}</span> como <span className="text-blue-700">PERMANENTE</span></p>

                              <div className="flex items-center gap-2">
                                {
                                  anos.map((ano, index) => (
                                    <div
                                      key={index}
                                      className={`
                                        border border-gray-300 flex items-center
                                        px-3 py-1 rounded-md hover:cursor-pointer
                                        ${anosComoPermanente.some(a => a.ano === ano.toString()) ? 'bg-blue-700 text-white' : 'bg-white text-black'}
                                      `}
                                      onClick={() => adicionarAnoComoPermanente(ano.toString())}
                                    >
                                      {ano}
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      <hr />

                      { /* Rafael - Modificações pro IAPÓS */}

                      <div className="flex">
                        <Tabs defaultValue="entrada" className="w-full ">
                          <div className="flex items-center justify-between mb-3">
                            <TabsList className="py-3">
                              <TabsTrigger value="entrada">Entrada &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "PROJETO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "PROJETO").length : "0"}</span></TabsTrigger> <Separator orientation="vertical" />
                              <TabsTrigger value="projetos_defendidos">Projetos Defendidos &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "QUALIFICAÇÃO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "QUALIFICAÇÃO").length : "0"}</span></TabsTrigger> <Separator orientation="vertical" />
                              <TabsTrigger value="qualificados">Qualificados &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "CONCLUSÃO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "CONCLUSÃO").length : "0"}</span></TabsTrigger> <Separator orientation="vertical" />
                              <TabsTrigger value="concluidos">Concluídos &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "FINALIZADO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "FINALIZADO").length : "0"}</span></TabsTrigger>
                            </TabsList>

                            <Dialog open={openDialogAdicionar} onOpenChange={setOpenDialogAdicionar}>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setIdOrientador(props.researcher_id)
                                  }}
                                >
                                  Adicionar orientando
                                </Button>
                              </DialogTrigger>

                              <DialogContent
                                onCloseAutoFocus={() => {
                                  limparCampos()
                                }}
                                className="w-[60%]"
                              >
                                <p className="text-3xl font-bold">Adicione um orientando para este docente</p>

                                <form className="flex flex-col gap-3 text-sm" action="">
                                  <div className="flex gap-3">
                                    <div className="flex flex-col gap-3 w-full border border-gray-300 rounded-md p-3">
                                      <div className="flex items-center justify-between">
                                        <label className="text-lg font-bold" htmlFor="name">Orientando: </label>

                                        <select
                                          className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                          onClick={() => buscarDiscentes()}
                                          onChange={(event) => {
                                            setIdOrientando(event.target.value)
                                          }}
                                        >
                                          <option value="" disabled selected>Selecione um orientando</option>
                                          {discentesPosGraduacao &&
                                            discentesPosGraduacao
                                              .slice() // cria uma cópia para não mutar o original
                                              .sort((a, b) => a.name.localeCompare(b.name)) // ordena por nome
                                              .map((discente) => (
                                                discente.oriented === false && (
                                                  <option key={discente.researcher_id} value={discente.researcher_id}>
                                                    {discente.name}
                                                  </option>
                                                )
                                              ))
                                          }
                                        </select>
                                      </div>

                                      <div className="flex items-center justify-between gap-0">
                                        <label className="text-lg font-bold" htmlFor="name">Coorientador: </label>
                                        <select
                                          className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                          onChange={(event) => {
                                            setIdCoorientador(event.target.value)
                                          }}
                                        >
                                          <option disabled selected>Selecione um coorientador</option>
                                          {
                                            docentesPosGraduacao && docentesPosGraduacao
                                              .slice()
                                              .sort((a, b) => a.name.localeCompare(b.name))
                                              .map((docente) => (
                                                props.researcher_id !== docente.researcher_id ?
                                                  <option key={docente.researcher_id} value={docente.researcher_id}>{docente.name}</option>
                                                  :
                                                  <option disabled key={docente.researcher_id} value={docente.researcher_id}>{docente.name} - Docente selecionado</option>
                                              ))
                                          }
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 flex-grow border border-gray-300 rounded-md p-3">

                                    <p className="text-lg font-bold min-w-fit">Selecione a data de entrada: </p>

                                    <label className="flex w-full items-center gap-2 hover:cursor-pointer" htmlFor="dataEntrada">
                                      <input
                                        className="hover:cursor-pointer w-full border-[3px] ml-5 py-1 px-4 rounded-md"
                                        type="date"
                                        name="dataEntrada"
                                        id="dataEntrada"
                                        onChange={(e) => {
                                          setDataEntrada(e.target.value);
                                        }}
                                      />
                                    </label>
                                  </div>

                                  <div className="flex items-center gap-1 flex-grow border border-gray-300 rounded-md p-3">

                                    <p className="text-lg font-bold min-w-fit">Selecione uma configuração de data: </p>

                                    <select
                                      className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                      onClick={() => {
                                        if (dataEntrada == null) {
                                          alert("Selecione uma data de entrada antes de aplicar a configuração de data!")
                                        }
                                      }}
                                      onChange={(event) => {
                                        const obj = JSON.parse(event.target.value);
                                        setConfigDataSelecionada(obj)
                                      }}
                                    >
                                      <option disabled selected>Selecione uma configuração</option>
                                      {
                                        configDatas && configDatas
                                          .slice()
                                          .sort((a, b) => a.config_name.localeCompare(b.config_name))
                                          .map((data) => (
                                            <option key={data.id} value={JSON.stringify(data)}>
                                              {data.config_name}
                                            </option>
                                          ))
                                      }

                                    </select>

                                    {
                                      configDataSelecionada && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Info className="ml-2" size={28} color="black" />
                                          </TooltipTrigger>

                                          <TooltipContent>
                                            <h4 className="text-lg font-semibold">Configuração selecionada</h4>
                                            <p><strong>Defesa de projeto: </strong> {configDataSelecionada.duration_project_months} meses</p>
                                            <p><strong>Qualificação: </strong> {configDataSelecionada.duration_qualification_months} meses</p>
                                            <p><strong>Conclusão: </strong> {configDataSelecionada.duration_conclusion_months} meses</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )
                                    }
                                  </div>

                                  <div className="flex gap-3 w-full border border-gray-300 rounded-md p-3">
                                    <div className="flex w-full items-center justify-between gap-2">
                                      <label className="text-lg font-bold whitespace-nowrap" htmlFor="Tag">
                                        Tag (opcional):
                                      </label>

                                      <select
                                        className="w-full min-w-fit border-[3px] ml-3 py-2 px-4 rounded-md"
                                        defaultValue="" // evita ficar com um valor preso
                                        onChange={(event) => {
                                          const obj = JSON.parse(event.target.value);
                                          setTagsSelecionadas((tagsSelecionadas) => [...tagsSelecionadas, obj]);
                                          event.target.value = ""; // reseta o select após selecionar
                                        }}
                                      >
                                        <option value="" disabled>
                                          Selecione uma tag
                                        </option>

                                        {
                                          tags &&
                                          tags
                                            // 🚫 não mostra tags que já foram selecionadas
                                            .filter((tag) => !tagsSelecionadas.some((t) => t.id === tag.id))
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((tag) => (
                                              <option key={tag.id} value={JSON.stringify(tag)}>
                                                {tag.name}
                                              </option>
                                            ))
                                        }
                                      </select>

                                      {tagsSelecionadas.length > 0 && (
                                        <div className="flex items-center w-1/2 gap-2">
                                          <p className="font-bold text-lg whitespace-nowrap">Tags selecionadas:</p>
                                          <div className="flex border border-gray-300 rounded-md p-3 overflow-x-auto gap-2">
                                            {tagsSelecionadas.map((tag) => (
                                              <div
                                                key={tag.id}
                                                className="flex items-center rounded-sm border overflow-hidden border-gray-300 flex-shrink-0 min-w-max"
                                              >
                                                <span title="Remover tag" className="bg-red-400 p-1 h-full flex items-center gap-2 w-fit">
                                                  <X
                                                    onClick={() =>
                                                      setTagsSelecionadas((tagsSelecionadas) =>
                                                        tagsSelecionadas.filter((t) => t.id !== tag.id)
                                                      )
                                                    }
                                                    className="text-black hover:cursor-pointer"
                                                    size={17}
                                                  />
                                                </span>
                                                <p className="p-1 whitespace-nowrap w-fit">{tag.name}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>


                                  <div
                                    className={`flex flex-col gap-3 border rounded-md h-[400px] p-3 ${tipoOrientacao === "Mestrado" && "h-fit"}`}
                                    style={{ boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.25)' }}
                                  >
                                    {tipoOrientacao === "Doutorado" &&

                                      <div className="flex flex-col p-3 gap-3 border-dashed border-black border-[2px] rounded-md">
                                        <p className="text-lg font-bold">Defesa do Projeto</p>
                                        <div className="flex items-center gap-3">

                                          <div className="flex gap-2 items-center w-1/2">
                                            <label
                                              htmlFor="dataPrevista
                                          on
                                        ">Prevista: </label>
                                            <input
                                              className="w-full border-[2px] border-bl px-2 py-1 rounded-md"
                                              onClick={() => {
                                                if (dataEntrada == null) {
                                                  alert("Selecione a DATA DE ENTRADA e a CONFIGURAÇÃO DE DATA. Após isso, você poderá modificar as datas previstas caso queira!");
                                                  return;
                                                }
                                              }}
                                              onKeyDown={(e) => {

                                              }}
                                              onChange={(e) => {
                                                setDataPrevisaoDefesa(e.target.value);
                                              }}
                                              type="date"
                                              id="dataPrevista"
                                              value={dataPrevisaoDefesa == null ? "" : dataPrevisaoDefesa}
                                            />
                                          </div>

                                          <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataRealizada">Realizada: </label>
                                            <input
                                              className="w-full border-[2px] px-2 py-1 rounded-md"
                                              onClick={() => {
                                                if (dataPrevisaoDefesa == null) {
                                                  alert("Não é possível definir a data de realização do projeto sem a data de entrada!");
                                                }
                                              }}
                                              onChange={(e) => {
                                                setDataRealizadaDefesa(e.target.value);
                                              }}
                                              type="date"
                                              value={dataRealizadaDefesa == null ? "" : dataRealizadaDefesa}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    }

                                    <div className={`${tipoOrientacao === "Mestrado" && "-h-fit"} flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md`}>
                                      <p className="text-lg font-bold">Qualificação </p>
                                      <div className="flex items-center gap-3">
                                        <div className="flex gap-2 items-center w-1/2">
                                          <label htmlFor="dataPrevista">Prevista: </label>
                                          <input
                                            className="w-full border-[2px] px-2 py-1 rounded-md"
                                            onClick={() => {
                                              if (dataPrevisaoQualificacao == null) {
                                                alert("Selecione a DATA DE ENTRADA e a CONFIGURAÇÃO DE DATA. Após isso, você poderá modificar as datas previstas caso queira!");
                                                return;
                                              }
                                            }}
                                            onChange={(e) => {
                                              setDataPrevisaoQualificacao(e.target.value);
                                              // gerarDatas(e.target.value, "QUALIFICACAO");
                                            }}
                                            type="date"
                                            id="dataPrevista"
                                            value={dataPrevisaoQualificacao == null ? "" : dataPrevisaoQualificacao}
                                          />
                                        </div>

                                        <div className="flex gap-2 items-center w-1/2">
                                          <label htmlFor="dataRealizada">Realizada: </label>
                                          <input
                                            className="w-full border-[2px] px-2 py-1 rounded-md"
                                            type="date"
                                            onClick={() => {
                                              if (dataEntrada == null) {
                                                alert("Não é possível definir a data de realização de qualificação sem a data de entrada!");
                                                return;
                                              } else {
                                                if (dataRealizadaDefesa == null) {
                                                  alert("A orientação deve ter defesa concluída para definir a data de qualificação!");
                                                }
                                              }
                                            }}
                                            onChange={(e) => {
                                              setDataRealizadaQualificacao(e.target.value);
                                            }}
                                            value={dataRealizadaQualificacao == null ? "" : dataRealizadaQualificacao}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className={`${tipoOrientacao === "Mestrado" && "h-fit"} flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md`}>
                                      <p className="text-lg font-bold">Defesa final</p>
                                      <div className="flex items-center gap-3">
                                        <div className={`flex gap-2 items-center w-1/2`}>
                                          <label htmlFor="dataPrevista">Prevista: </label>
                                          <input
                                            className="w-full border-[2px] px-2 py-1 rounded-md"
                                            onClick={() => {
                                              if (dataPrevisaoDefesaFinal == null) {
                                                alert("Selecione a DATA DE ENTRADA e a CONFIGURAÇÃO DE DATA. Após isso, você poderá modificar as datas previstas caso queira!");
                                                return;
                                              }

                                              if (dataPrevisaoQualificacao == null) {
                                                alert("Não é possível adicionar data de realização de defesa final sem qualificação realizada!")
                                              }
                                            }}
                                            onChange={(e) => {
                                              setDataPrevisaoDefesaFinal(e.target.value);
                                            }}
                                            type="date"
                                            id="dataPrevista"
                                            value={dataPrevisaoDefesaFinal == null ? "" : dataPrevisaoDefesaFinal}
                                          />
                                        </div>

                                        <div className="flex gap-2 items-center w-1/2">
                                          <label htmlFor="dataRealizada">Realizada: </label>
                                          <input
                                            className="w-full border-[2px] px-2 py-1 rounded-md"
                                            type="date"
                                            onClick={() => {
                                              if (dataEntrada == null) {
                                                alert("Para modificar a data de realização da defesa final, primeiro selecione uma DATA DE ENTRADA!");
                                                return;
                                              } else {
                                                if (dataRealizadaQualificacao == null) {
                                                  alert("A orientação deve ter defesa e qualificação concluídas para definir a data de defesa final!");
                                                }
                                              }


                                            }}
                                            onChange={(e) => {
                                              setDataRealizadaDefesaFinal(e.target.value);
                                            }}
                                            value={dataRealizadaDefesaFinal == null ? "" : dataRealizadaDefesaFinal}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      className="bg-[#559FB8] text-white px-4 py-2 rounded-md transition-all duration-75 active:scale-95"
                                      onClick={(e) => {
                                        salvarOrientando(e);
                                      }}
                                    >Salvar orientação</button>
                                  </div>
                                </form>

                                <DialogClose
                                  className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-md"
                                  title="Fechar"
                                  onClick={() => {
                                    limparCampos();
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </DialogClose>
                              </DialogContent>

                            </Dialog>

                          </div>

                          <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="entrada">
                            {orientacoes?.filter((o: any) => o.type === "PROJETO").length > 0 ? (
                              orientacoes
                                .filter((o: any) => o.type === "PROJETO")
                                .map((o: any) => (
                                  <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={props} buscarOrientacoes={buscarOrientacoesPorDocente} />
                                ))
                            ) : (
                              <p className="p-3 animate-pulse">
                                Sem orientações novas para este docente.
                              </p>
                            )}
                          </TabsContent>

                          <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="projetos_defendidos">
                            {orientacoes?.filter((o: any) => o.type === "QUALIFICAÇÃO").length > 0 ? (
                              orientacoes
                                .filter((o: any) => o.type === "QUALIFICAÇÃO")
                                .map((o: any) => (
                                  <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={props} buscarOrientacoes={buscarOrientacoesPorDocente} />
                                ))
                            ) : (
                              <p className="p-3 animate-pulse">
                                Sem orientações a defender para este docente.
                              </p>
                            )}
                          </TabsContent>

                          <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="qualificados">
                            {orientacoes?.filter((o: any) => o.type === "CONCLUSÃO").length > 0 ? (
                              orientacoes
                                .filter((o: any) => o.type === "CONCLUSÃO")
                                .map((o: any) => (
                                  <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={props} buscarOrientacoes={buscarOrientacoesPorDocente} />
                                ))
                            ) : (
                              <p className="p-3 animate-pulse">
                                Sem orientações a qualificar para este docente.
                              </p>
                            )}
                          </TabsContent>

                          <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="concluidos">
                            {orientacoes?.filter((o: any) => o.type === "FINALIZADO").length > 0 ? (
                              orientacoes
                                .filter((o: any) => o.type === "FINALIZADO")
                                .map((o: any) => (
                                  <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={props} buscarOrientacoes={buscarOrientacoesPorDocente} />
                                ))
                            ) : (
                              <p className="p-3 animate-pulse">
                                Sem orientações concluídas para este docente.
                              </p>
                            )}
                          </TabsContent>


                        </Tabs>

                      </div>
                    </div>


                  </AccordionContent>
                </AccordionItem>
              </Alert>
            ))}
          </Accordion>
        </div>

      </div >
    </div >
  )
}