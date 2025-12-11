import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function ParticipacoesEventos() {
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
              Participações em Eventos
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

        {/* Sobre Participação em Eventos no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Participação em Eventos na plataforma {platform}</h2>
          <p>
            A seção de Participação em Eventos da plataforma {platform} reúne os registros da presença de pesquisadores em congressos, simpósios, encontros, seminários, oficinas e demais atividades científicas e acadêmicas. Esses registros demonstram o envolvimento ativo dos pesquisadores com comunidades científicas e espaços de troca de saberes {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada participação registrada apresenta:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Nome do evento</strong></li>
            <li><strong>Ano de realização</strong></li>
            <li><strong>Tipo de evento:</strong> congresso, simpósio, seminário, oficina, entre outros</li>
            <li><strong>Papel do pesquisador:</strong> participante, ouvinte, convidado, expositor, organizador, entre outros</li>
          </ul>
          <p className="mt-3">
            Essas informações são organizadas de forma padronizada e vinculadas ao perfil individual do pesquisador, permitindo uma análise clara de sua inserção na vida científica e acadêmica.
          </p>
        </Alert>

        {/* Análise por Ano e Tipo de Evento */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Análise por Ano e Tipo de Evento</h2>
          <p>
            A seção permite aplicar filtros por ano, além de exibir gráficos com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Distribuição anual das participações</li>
            <li>Frequência por tipo de evento (nacional, internacional, regional)</li>
            <li>Volume de engajamento científico ao longo do tempo</li>
          </ul>
          <p className="mt-3">
            Essa visualização contribui para análises institucionais e individuais sobre o nível de envolvimento científico e a projeção do pesquisador em diferentes contextos acadêmicos.
          </p>
        </Alert>

        {/* O Papel dos Eventos na Atuação Acadêmica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Papel dos Eventos na Atuação Acadêmica</h2>
          <p>
            A participação em eventos é um componente fundamental da vida científica e acadêmica, pois permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Atualização de conhecimentos</strong> e práticas com as tendências da área</li>
            <li><strong>Intercâmbio com outros pesquisadores</strong> e instituições</li>
            <li><strong>Discussão de ideias</strong> e compartilhamento de experiências</li>
            <li><strong>Ampliação da rede de contatos acadêmicos</strong> e profissionais</li>
          </ul>
          <p className="mt-3">
            Esse tipo de envolvimento também fortalece a visibilidade do pesquisador em sua área de atuação e reforça seu papel como agente de diálogo e disseminação do conhecimento.
          </p>
        </Alert>

        {/* O Pesquisador e a Dinâmica dos Eventos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador e a Dinâmica dos Eventos</h2>
          <p>
            Os registros de participação demonstram que o pesquisador:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Está inserido em ambientes colaborativos</strong> de formação contínua</li>
            <li><strong>Tem presença ativa em debates</strong> e construção coletiva de conhecimento</li>
            <li><strong>Contribui para a visibilidade institucional</strong> e regional da produção científica</li>
          </ul>
          <p className="mt-3">
            Além disso, muitos eventos são espaços de origem ou desdobramento de artigos, projetos e colaborações científicas importantes.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            A participação em eventos está conectada a outras categorias exibidas na plataforma {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Trabalhos apresentados em eventos</strong></li>
            <li><strong>Artigos científicos</strong> – frequentemente originados em eventos</li>
            <li><strong>Livros e capítulos</strong> – apresentados ou discutidos em simpósios</li>
            <li><strong>Projetos de pesquisa</strong> – divulgados ou aprimorados em congressos</li>
            <li><strong>Relatórios técnicos e orientações acadêmicas</strong> – vinculados à participação em oficinas e seminários</li>
          </ul>
          <p className="mt-3">
            Essa integração evidencia como os eventos são pontos estratégicos de articulação entre produção, formação e colaboração científica, ampliando o impacto real da pesquisa.
          </p>
        </Alert>

        {/* Documentação da API de Participação em Eventos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Participação em Eventos</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar participações em eventos:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_production/events
              </code>
            </div>
        
            {/* Filtros Disponíveis */}
            <div>
              <h3 className="font-semibold">Filtros Disponíveis</h3>
              <table className="w-full table-auto border-collapse mt-2 text-sm">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border px-4 py-2 text-left">Nome do Parâmetro</th>
                    <th className="border px-4 py-2 text-left">Tipo</th>
                    <th className="border px-4 py-2 text-left">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">researcher_id</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">ID do pesquisador (pode ser vazio para busca geral)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">year</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Ano(s) de participação, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas participações distintas (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_production/events?year=2022;2023&amp;distinct=1
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando uma participação em evento. Os principais campos retornados são:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border px-4 py-2 text-left">Campo</th>
                      <th className="border px-4 py-2 text-left">Tipo</th>
                      <th className="border px-4 py-2 text-left">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">authors</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome(s) do(s) participante(s)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">homepage</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Página ou link do evento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">language</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Idioma do evento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">means_divulgation</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Meio de divulgação (nome do evento, congresso, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">nature</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Natureza da participação (apresentação, ouvinte, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">relevance</td>
                      <td className="border px-4 py-2">boolean</td>
                      <td className="border px-4 py-2">Se a participação é considerada relevante</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">scientific_divulgation</td>
                      <td className="border px-4 py-2">boolean</td>
                      <td className="border px-4 py-2">Se é divulgação científica</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título da participação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title_en</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título em inglês</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year_</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano da participação</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Observação: Os campos podem variar conforme o endpoint e o tipo de busca utilizada.
              </p>
            </div>
          </div>
        </Alert>
      </div>
    </main>
  );
}