import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function PatentesInfos() {
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
              Patentes e Propriedade Intelectual
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

        {/* Sobre Patentes no {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Patentes no {platform}</h2>
          <p>
            A seção de Patentes na {platform} reúne os registros de propriedade intelectual vinculados aos pesquisadores, destacando sua capacidade de inovar, desenvolver soluções aplicadas e transformar conhecimento científico em produtos, processos e tecnologias com potencial de impacto social e econômico.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Para cada patente cadastrada, o sistema apresenta:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título da invenção</strong></li>
            <li><strong>Tipo de registro:</strong> patente ou software</li>
            <li><strong>Situação do pedido:</strong> concedido ou não concedido</li>
            <li><strong>Ano de depósito ou publicação</strong></li>
            <li><strong>Nome do(s) autor(es)</strong></li>
          </ul>
          <p className="mt-3">
            Essas informações estão organizadas em formato padronizado e conectadas ao perfil de cada pesquisador, permitindo uma análise clara e contextualizada.
          </p>
        </Alert>

        {/* Exploração e Acompanhamento por Ano */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Exploração e Acompanhamento por Ano</h2>
          <p>
            A plataforma permite filtrar os registros de patentes por ano, possibilitando:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Análise da evolução da produção tecnológica ao longo do tempo</li>
            <li>Visualização de gráficos de crescimento ou retração na área</li>
            <li>Identificação de períodos de maior atividade inventiva</li>
          </ul>
          <p className="mt-3">
            Esse recurso é útil tanto para análise institucional quanto para estudos estratégicos sobre inovação científica {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Patentes e o Perfil do Pesquisador */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Patentes e o Perfil do Pesquisador</h2>
          <p>
            As patentes fazem parte do portfólio técnico do pesquisador e refletem:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>O envolvimento com desenvolvimento científico aplicado</li>
            <li>A participação em projetos de pesquisa voltados à inovação</li>
            <li>A atuação em contextos multidisciplinares e colaborativos</li>
          </ul>
          <p className="mt-3">
            Esses registros ampliam a compreensão do papel do pesquisador na interface entre ciência, tecnologia e sociedade.
          </p>
        </Alert>

        {/* Valor Científico e Estratégico das Patentes */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Valor Científico e Estratégico das Patentes</h2>
          <p>
            A produção tecnológica registrada por meio de patentes é um indicador importante porque:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Representa soluções concretas com possibilidade de aplicação prática</li>
            <li>Demonstra originalidade e domínio técnico-científico</li>
            <li>Contribui para o reconhecimento do pesquisador em ambientes de inovação</li>
          </ul>
          <p className="mt-3">
            Esses aspectos são relevantes tanto para avaliação acadêmica quanto para captação de recursos, fomento e parcerias tecnológicas.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            As patentes são apresentadas junto a outras categorias da produção na {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Livros e capítulos</strong></li>
            <li><strong>Softwares</strong></li>
            <li><strong>Participações em eventos e orientações</strong></li>
          </ul>
          <p className="mt-3">
            Essa integração proporciona uma leitura ampla e coerente da trajetória profissional e intelectual do pesquisador, evidenciando sua contribuição técnica e científica de forma integrada.
          </p>
        </Alert>

        {/* Documentação da API de Patentes */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Patentes</h2>

          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar patentes:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/patent_production_researcher
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
                    <td className="border px-4 py-2">term</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Termos de busca (palavras-chave, nomes, etc)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas patentes distintas (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/patent_production_researcher?year=2022;2023&amp;term=biotecnologia&amp;distinct=1
              </code>
            </div>

            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando uma patente. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador da patente</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">grant_date</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Data de concessão</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título da patente</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de publicação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">financing</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Financiamento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">project_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do projeto relacionado</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do pesquisador/inventor</td>
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