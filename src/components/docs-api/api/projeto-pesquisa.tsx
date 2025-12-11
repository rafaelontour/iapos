import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function ProjetoPesquisa() {
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
              Projetos de Pesquisa
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

        {/* Sobre Projetos de Pesquisa no {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Projetos de Pesquisa no {platform}</h2>
          <p>
            A seção de Projetos de Pesquisa da {platform} apresenta os registros de projetos desenvolvidos por pesquisadores vinculados {platform === "Conectee" ? "à Escola de Engenharia da UFMG" : "às instituições públicas da Bahia"}, abrangendo tanto projetos acadêmicos quanto de extensão. Esses registros são fundamentais para compreender o escopo, a relevância e os objetivos das iniciativas científicas em curso ou já concluídas.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada projeto exibido no sistema inclui:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título do projeto</strong></li>
            <li><strong>Natureza:</strong> pesquisa ou extensão</li>
            <li><strong>Situação atual:</strong> em andamento ou concluído</li>
            <li><strong>Autor ou responsável:</strong> nome do coordenador do projeto</li>
            <li><strong>Informações institucionais:</strong> quando disponíveis</li>
          </ul>
          <p className="mt-3">
            Esses dados são organizados de forma padronizada e vinculados diretamente ao perfil do pesquisador, permitindo uma análise clara de sua trajetória e envolvimento com projetos.
          </p>
        </Alert>

        {/* Filtros Temporais e Visualização Histórica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Filtros Temporais e Visualização Histórica</h2>
          <p>
            Os projetos podem ser filtrados por ano, o que permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Analisar a distribuição de projetos ao longo do tempo</li>
            <li>Identificar períodos com maior volume de submissões</li>
            <li>Observar tendências institucionais e temáticas</li>
          </ul>
          <p className="mt-3">
            Gráficos de acompanhamento estão disponíveis para auxiliar na análise estratégica de produção científica e engajamento institucional.
          </p>
        </Alert>

        {/* Importância dos Projetos de Pesquisa na Trajetória Científica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância dos Projetos de Pesquisa na Trajetória Científica</h2>
          <p>
            Os projetos de pesquisa são a base da produção científica, técnica e social. Sua presença na {platform} reflete:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>O planejamento e execução</strong> de investigações científicas estruturadas</li>
            <li><strong>A produção de conhecimento original</strong> e de impacto</li>
            <li><strong>A captação de recursos</strong> por meio de editais e programas de fomento</li>
            <li><strong>O envolvimento com demandas sociais</strong> e políticas públicas, especialmente nos projetos de extensão</li>
          </ul>
          <p className="mt-3">
            Esses elementos são essenciais para avaliar o papel do pesquisador dentro do ecossistema científico e social {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* O Pesquisador e a Coordenação de Projetos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador e a Coordenação de Projetos</h2>
          <p>
            A atuação em projetos revela que o pesquisador:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Lidera ou participa</strong> de iniciativas colaborativas</li>
            <li><strong>Integra redes de pesquisa</strong> institucionalizadas e interinstitucionais</li>
            <li><strong>Contribui com a formação</strong> de novos pesquisadores, incluindo bolsistas e estudantes</li>
          </ul>
          <p className="mt-3">
            Além disso, esses registros ajudam a identificar linhas de atuação científica, interesses temáticos e níveis de envolvimento com o território e as demandas regionais.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            Os projetos de pesquisa estão conectados a diversas outras categorias da {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong> e livros gerados</li>
            <li><strong>Trabalhos em eventos</strong> associados</li>
            <li><strong>Relatórios técnicos</strong> produzidos</li>
            <li><strong>Softwares e patentes</strong> resultantes</li>
            <li><strong>Orientações acadêmicas</strong> vinculadas ao projeto</li>
          </ul>
          <p className="mt-3">
            Essa relação evidencia os desdobramentos reais de cada projeto na produção acadêmica do pesquisador, oferecendo uma visão integrada entre planejamento, execução e resultados concretos.
          </p>
        </Alert>

        {/* Documentação da API de Projetos de Pesquisa */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Projetos de Pesquisa</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar projetos de pesquisa:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_research_project
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
                    <td className="border px-4 py-2">term</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Termo de busca (palavra-chave, opcional)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">year</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Ano(s) de início, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas projetos distintos (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_research_project?year=2022;2023&amp;distinct=1
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um projeto de pesquisa. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">id</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Identificador do projeto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">project_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do projeto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">nature</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Natureza (pesquisa, extensão, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">status</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Situação atual (em andamento, concluído, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">description</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Descrição do projeto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">start_year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de início</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">end_year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de término</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">agency_code</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Código da agência de fomento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">agency_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome da agência de fomento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">number_academic_masters</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Número de mestres acadêmicos envolvidos</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">number_phd</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Número de doutores envolvidos</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">number_specialists</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Número de especialistas envolvidos</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">number_undergraduates</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Número de graduandos envolvidos</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">researcher_id</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">ID do pesquisador responsável</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">researcher_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do pesquisador responsável</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">production</td>
                      <td className="border px-4 py-2">array</td>
                      <td className="border px-4 py-2">Lista de produções vinculadas ao projeto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">foment</td>
                      <td className="border px-4 py-2">array</td>
                      <td className="border px-4 py-2">Lista de fomentos/agências de apoio</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">components</td>
                      <td className="border px-4 py-2">array</td>
                      <td className="border px-4 py-2">Lista de componentes (pesquisadores, estudantes, etc.)</td>
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