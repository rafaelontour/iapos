import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function RelatorioTecnico() {
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
              Relatórios Técnicos
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

        {/* Sobre Relatórios Técnicos na {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Relatórios Técnicos no {platform}</h2>
          <p>
            A seção de Relatórios Técnicos da {platform} reúne registros que refletem a aplicação prática da pesquisa científica em contextos reais. Esses documentos representam entregas formais de projetos, diagnósticos, pareceres técnicos e estudos de campo, frequentemente produzidos em parceria com {platform === "Conectee" ? "a Escola de Engenharia da UFMG" : "instituições públicas, agências de fomento ou organizações sociais da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada relatório técnico é exibido com informações essenciais que incluem:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título do relatório</strong></li>
            <li><strong>Ano de elaboração ou publicação</strong></li>
            <li><strong>Instituição associada:</strong> execução ou financiamento</li>
            <li><strong>Autoria vinculada ao pesquisador</strong></li>
          </ul>
          <p className="mt-3">
            Esses dados são organizados de forma padronizada, associados ao perfil do pesquisador e integrados à sua produção técnica, facilitando análise contextualizada e histórica.
          </p>
        </Alert>

        {/* Exploração por Ano e Análise Temporal */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Exploração por Ano e Análise Temporal</h2>
          <p>
            O sistema permite filtrar os relatórios técnicos por ano de produção, oferecendo:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Visualização cronológica da produção técnica</li>
            <li>Acompanhamento de tendências temáticas ao longo dos anos</li>
            <li>Apoio a análises institucionais, regionais ou por áreas do conhecimento</li>
          </ul>
          <p className="mt-3">
            Gráficos ilustram a evolução da produção ao longo do tempo, ajudando gestores e pesquisadores a entenderem melhor o impacto e distribuição dessas contribuições.
          </p>
        </Alert>

        {/* Importância dos Relatórios na Produção Científica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância dos Relatórios na Produção Científica</h2>
          <p>
            Relatórios técnicos são fundamentais para evidenciar:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>A aplicabilidade</strong> dos conhecimentos científicos em contextos sociais, educacionais ou ambientais</li>
            <li><strong>A transferência de conhecimento</strong> para a gestão pública, organizações sociais e políticas públicas</li>
            <li><strong>A responsividade</strong> da pesquisa científica às demandas práticas da sociedade</li>
          </ul>
          <p className="mt-3">
            Eles complementam a produção acadêmica tradicional com uma dimensão prática e socialmente relevante.
          </p>
        </Alert>

        {/* O Pesquisador e a Produção Técnica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador e a Produção Técnica</h2>
          <p>
            A presença de relatórios técnicos no perfil do pesquisador mostra que sua atuação:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Vai além da produção bibliográfica tradicional</li>
            <li>Inclui envolvimento direto com <strong>projetos aplicados e ações de impacto</strong></li>
            <li>Contribui com a construção de soluções baseadas em <strong>evidência científica</strong></li>
          </ul>
          <p className="mt-3">
            Essa produção técnica valoriza o pesquisador como um agente ativo na interface entre ciência, tecnologia e sociedade.
          </p>
        </Alert>

        {/* Integração com Outras Categorias de Produção */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Categorias de Produção</h2>
          <p>
            Relatórios técnicos fazem parte do mapeamento completo da produção científica na {platform}, e são apresentados junto com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Livros e capítulos</strong></li>
            <li><strong>Patentes e softwares</strong></li>
            <li><strong>Eventos e orientações acadêmicas</strong></li>
          </ul>
          <p className="mt-3">
            Essa integração oferece uma visão ampla da contribuição do pesquisador em múltiplas dimensões da ciência, evidenciando tanto a produção teórica quanto as aplicações práticas de seu trabalho {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Documentação da API de Relatórios Técnicos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Relatórios Técnicos</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar relatórios técnicos:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_report
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
                    <td className="border px-4 py-2">Ano(s) de publicação, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas relatórios distintos (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_report?year=2022;2023&amp;distinct=1
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um relatório técnico. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador do relatório técnico</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">grant_date</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Data de entrega/conclusão</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título do relatório</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de elaboração/publicação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">financing</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Instituição financiadora ou associada</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">project_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do projeto relacionado</td>
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