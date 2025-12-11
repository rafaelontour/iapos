import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function TrabalhoEvento() {
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
              Trabalhos em Eventos
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

        {/* Sobre Trabalhos em Eventos na {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Trabalhos em Eventos no {platform}</h2>
          <p>
            A seção de Trabalhos em Eventos da {platform} reúne os registros das produções apresentadas por pesquisadores em congressos, simpósios, seminários e encontros científicos. Essa participação representa um espaço essencial de troca de conhecimentos, validação de pesquisas em andamento e inserção em comunidades acadêmicas especializadas {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada trabalho em evento registrado no sistema apresenta dados como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título do trabalho</strong></li>
            <li><strong>Tipo de submissão:</strong> resumo, resumo expandido ou completo</li>
            <li><strong>Nome do autor(a)</strong></li>
            <li><strong>Nome do evento</strong> (quando disponível)</li>
            <li><strong>Ano da apresentação</strong></li>
          </ul>
          <p className="mt-3">
            Essas informações são vinculadas ao perfil do pesquisador e organizadas de forma padronizada, facilitando a análise de sua produção e engajamento científico.
          </p>
        </Alert>

        {/* Exploração Temporal e Gráfica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Exploração Temporal e Gráfica</h2>
          <p>
            A {platform} permite filtrar os trabalhos em eventos por ano de apresentação, além de disponibilizar gráficos com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Distribuição da produção ao longo dos anos</li>
            <li>Variações de volume por período</li>
            <li>Tendências institucionais ou temáticas</li>
          </ul>
          <p className="mt-3">
            Isso facilita o acompanhamento da trajetória acadêmica do pesquisador e o mapeamento institucional de sua atuação em eventos científicos {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Importância dos Trabalhos em Eventos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância dos Trabalhos em Eventos</h2>
          <p>
            A publicação e apresentação de trabalhos em eventos científicos:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Permite a divulgação</strong> de resultados parciais ou finais de pesquisa</li>
            <li><strong>Favorece a interação</strong> entre pesquisadores, estudantes e instituições</li>
            <li><strong>Possibilita feedback qualificado</strong> e construção de colaborações</li>
            <li><strong>Contribui com a formação</strong> de redes científicas e interinstitucionais</li>
          </ul>
          <p className="mt-3">
            Esses elementos são fundamentais para a visibilidade e reconhecimento do pesquisador na comunidade científica.
          </p>
        </Alert>

        {/* O Pesquisador e sua Participação em Eventos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador e sua Participação em Eventos</h2>
          <p>
            A presença de trabalhos em eventos no perfil do pesquisador revela:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Envolvimento ativo</strong> com a comunidade científica</li>
            <li><strong>Interesse em comunicar,</strong> discutir e aprimorar resultados</li>
            <li><strong>Abertura para debates</strong> e validação externa de suas pesquisas</li>
          </ul>
          <p className="mt-3">
            Essa produção complementa os registros bibliográficos e técnicos, demonstrando dinamismo, atualização e interação contínua com o meio científico.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            Os trabalhos em eventos são apresentados ao lado de outras categorias de produção na {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Livros e capítulos</strong></li>
            <li><strong>Patentes e softwares</strong></li>
            <li><strong>Relatórios técnicos</strong></li>
            <li><strong>Orientações acadêmicas</strong></li>
            <li><strong>Texto em revista ou jornais</strong></li>
          </ul>
          <p className="mt-3">
            Essa abordagem integrada contribui para uma visão completa e multifacetada da atuação do pesquisador no ecossistema científico, evidenciando tanto a produção formal quanto o engajamento em atividades coletivas e dinâmicas {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Documentação da API de Trabalhos em Eventos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Trabalhos em Eventos</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar trabalhos em eventos:</h3>
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
                    <td className="border px-4 py-2">Ano(s) de apresentação, separados por ponto e vírgula (;)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_production/events?year=2022;2023
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um trabalho em evento. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Nome(s) do(s) autor(es)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">homepage</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Página ou link do trabalho</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">language</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Idioma do trabalho</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">means_divulgation</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Meio de divulgação (nome do evento, anais, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">nature</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Natureza do trabalho (resumo, completo, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">relevance</td>
                      <td className="border px-4 py-2">boolean</td>
                      <td className="border px-4 py-2">Se o trabalho é considerado relevante</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">scientific_divulgation</td>
                      <td className="border px-4 py-2">boolean</td>
                      <td className="border px-4 py-2">Se é divulgação científica</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título do trabalho</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title_en</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título em inglês</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year_</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de apresentação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">event_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do evento</td>
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