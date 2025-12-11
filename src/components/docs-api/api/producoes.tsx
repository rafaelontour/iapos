import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function Producoes() {
  const { version } = useContext(UserContext);
  const platform = version ? "Conectee" : "Simcc";
  const version2 = getVersion();

  return (
    <main className="p-4 md:p-8 bg-neutral-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-[936px] mx-auto space-y-8">
        {/* Header */}
        <Alert className="p-0">
          <div className="flex border-0 rounded-b-none justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6 rounded-md">
            <span className="text-base font-medium text-gray-600 dark:text-gray-300">
              Produções Científicas
            </span>
            <Link to="/">
              <Button variant="outline">
                <Home size={16} className="mr-2" />
                Página Inicial
              </Button>
            </Link>
          </div>

          {/* Banner Hero */}
          <div
            className="p-8 rounded-t-none md:p-12 bg-cover bg-center rounded-md"
            style={{ backgroundImage: `url(${bg_popup})` }}
          >
            <h1 className="text-4xl font-bold mb-2">
              Plataforma {platform}
            </h1>
            <p className="text-sm font-light">
              Versão da plataforma: {version2}
            </p>
          </div>
        </Alert>

        {/* Produções no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Produções na plataforma {platform}</h2>
          <p>
            As produções reunidas na plataforma {platform} representam a diversidade e profundidade das contribuições científicas, técnicas e acadêmicas dos pesquisadores vinculados {platform === "Conectee" ? "à Escola de Engenharia da UFMG" : "às instituições públicas da Bahia"}. São mapeadas a partir de fontes como a Plataforma Lattes e organizadas por categoria, ano, autoria e área de atuação.
          </p>
          <p className="mt-3">
            Essa organização permite análises individuais e coletivas, identificação de competências, acompanhamento da evolução da produção científica {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "no estado"} e estímulo à colaboração entre pesquisadores e instituições.
          </p>
        </Alert>

        {/* Categorias de Produção Disponíveis */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Categorias de Produção Disponíveis</h2>
          <p>
            A seguir estão as categorias disponíveis, organizadas conforme a estrutura da plataforma:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Pesquisadores:</strong> Informações detalhadas sobre os pesquisadores, incluindo titulação, grupos de pesquisa, indicadores (ORCID, SCOPUS), atualização do currículo e distribuição por área do conhecimento.</li>
            <li><strong>Bolsistas CNPq:</strong> Pesquisadores com bolsas de produtividade ou desenvolvimento tecnológico concedidas pelo CNPq, classificados por categoria (1A, 1B, 1C, 1D, 2, etc.), com análise por área do conhecimento, impacto e distribuição territorial.</li>
            <li><strong>Artigos:</strong> Publicações acadêmicas com metadados completos e indicadores de qualidade (DOI, Qualis, JCR), associadas diretamente ao perfil do pesquisador.</li>
            <li><strong>Livros:</strong> Obras completas de autoria ou coautoria, com dados como título, editora, ISBN e ano de publicação, organizadas por ano e autor.</li>
            <li><strong>Capítulos de Livros:</strong> Participações em obras coletivas, com título do capítulo, nome da obra, ano, editora e autoria, destacando contribuições temáticas específicas.</li>
            <li><strong>Patentes:</strong> Registros de invenções com valor tecnológico, incluindo título, situação do registro, ano e autor, refletindo inovação e aplicabilidade.</li>
            <li><strong>Softwares:</strong> Soluções digitais desenvolvidas no contexto de pesquisa, apresentadas com nome, ano de desenvolvimento e autor, indicando ciência aplicada.</li>
            <li><strong>Relatórios Técnicos:</strong> Documentos elaborados a partir de projetos, consultorias ou estudos técnicos, com título, instituição vinculada, ano e autoria.</li>
            <li><strong>Texto em revista ou jornais:</strong> Publicações em revistas e jornais com foco em divulgação científica, opinião ou educação, com título, veículo, autoria e ano.</li>
            <li><strong>Trabalhos em Eventos:</strong> Produções apresentadas em eventos científicos, como resumos, trabalhos completos ou expandidos, com classificação por tipo e ano.</li>
            <li><strong>Revistas:</strong> Periódicos científicos onde os pesquisadores publicam seus trabalhos, com informações como ISSN, nome do periódico, classificação Qualis e presença em bases como o Journal Citation Reports (JCR).</li>
            <li><strong>Projetos de Pesquisa:</strong> Registros de projetos de pesquisa e extensão, com título, tipo (pesquisa/extensão), status (concluído/em andamento) e responsável.</li>
            <li><strong>Marcas:</strong> Identidades registradas relacionadas a projetos, metodologias, plataformas ou serviços, com nome da marca, ano e autor vinculado.</li>
            <li><strong>Orientações:</strong> Atividades de orientação realizadas em níveis como iniciação científica, graduação, mestrado, doutorado e pós-doutorado, com dados completos sobre o orientando, título do trabalho, status e tipo de orientação.</li>
            <li><strong>Participações em Eventos:</strong> Registros da presença dos pesquisadores como participantes, ouvintes, convidados ou expositores em congressos, simpósios, seminários, oficinas e outros encontros científicos.</li>
          </ul>
        </Alert>

        {/* Visualização e Análises */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Visualização e Análises</h2>
          <p>
            Cada categoria pode ser explorada individualmente, com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Filtros por ano</strong></li>
            <li><strong>Gráficos de distribuição temporal</strong></li>
            <li><strong>Dados agregados por área do conhecimento,</strong> tipo de produção e autoria</li>
          </ul>
          <p className="mt-3">
            Essas visualizações permitem identificar tendências, monitorar evolução e apoiar decisões estratégicas nas instituições e órgãos de fomento.
          </p>
        </Alert>

        {/* Integração com Indicadores e Perfis */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Indicadores e Perfis</h2>
          <p>
            Todas as produções estão vinculadas diretamente ao perfil de cada pesquisador na plataforma {platform}. Isso permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Visualização integrada</strong> das contribuições por indivíduo</li>
            <li><strong>Identificação de linhas de pesquisa,</strong> especialidades e colaborações</li>
            <li><strong>Cruzamento de dados com orientações,</strong> grupos, programas e projetos</li>
          </ul>
          <p className="mt-3">
            Essa integração oferece uma visão completa da trajetória científica e técnica dos pesquisadores, facilitando análise qualificada e planejamento estratégico.
          </p>
        </Alert>

        {/* Explore as Produções Científicas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Explore as Produções Científicas</h2>
          <p>
            A partir desta página, você pode acessar cada uma das seções específicas para explorar em detalhes:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Quais são os artigos mais recentes?</strong></li>
            <li><strong>Que softwares e patentes estão registrados?</strong></li>
            <li><strong>Quem são os pesquisadores mais ativos em orientação?</strong></li>
            <li><strong>Em quais temas os pesquisadores têm publicado mais capítulos e livros?</strong></li>
          </ul>
          <p className="mt-3">
            Cada clique revela uma camada da riqueza científica e técnica construída por centenas de pesquisadores vinculados à plataforma {platform}.
          </p>
        </Alert>
      </div>
    </main>
  );
}