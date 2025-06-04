import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function ArtigosInfos() {
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
              Artigos Científicos
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

        {/* O Que São os Artigos no {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Que São os Artigos no {platform}</h2>
          <p>
            Os artigos científicos são uma das principais formas de expressão do conhecimento gerado pelos pesquisadores. Na {platform}, os artigos representam o núcleo da produção acadêmica, sendo exibidos com riqueza de detalhes e com foco na qualidade, autoria e impacto científico {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Quais Informações Cada Artigo Apresenta */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Quais Informações Cada Artigo Apresenta</h2>
          <p>
            Cada artigo listado no perfil de um pesquisador inclui:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título completo</strong></li>
            <li><strong>Resumo</strong></li>
            <li><strong>Autores e coautores</strong></li>
            <li><strong>Ano de publicação</strong></li>
            <li><strong>Periódico em que foi publicado</strong></li>
            <li><strong>DOI (Identificador Digital do Objeto)</strong></li>
            <li><strong>Classificações:</strong> Qualis e JCR (Journal Citation Reports)</li>
          </ul>
          <p className="mt-3">
            Esses dados ajudam a validar a relevância do artigo e sua inserção em bases científicas de prestígio.
          </p>
        </Alert>

        {/* Como os Artigos São Avaliados */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Como os Artigos São Avaliados</h2>
          <p>
            A {platform} organiza os artigos de forma a destacar sua relevância e qualidade por meio de:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Qualis:</strong> classificação CAPES que indica a relevância do periódico no contexto nacional.</li>
            <li><strong>JCR:</strong> índice de impacto internacional, indicando a visibilidade da revista.</li>
            <li><strong>Presença de DOI:</strong> que garante rastreabilidade e acesso direto ao artigo.</li>
          </ul>
          <p className="mt-3">
            Esses elementos ajudam na análise crítica das produções de cada pesquisador {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Para Que Servem os Artigos na {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Para Que Servem os Artigos na {platform}</h2>
          <p>
            Os artigos permitem:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Mapear as áreas de atuação dos pesquisadores</li>
            <li>Identificar tópicos de especialização</li>
            <li>Localizar colaborações científicas</li>
            <li>Contribuir com revisões bibliográficas direcionadas</li>
            <li>Facilitar buscas por termos ou autores específicos</li>
          </ul>
        </Alert>

        {/* Como os Artigos Conectam Pesquisadores */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Como os Artigos Conectam Pesquisadores</h2>
          <p>
            Ao analisar os artigos publicados, é possível:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Ver quem são os coautores mais frequentes</li>
            <li>Entender as redes de pesquisa formadas</li>
            <li>Encontrar grupos e linhas de pesquisa com afinidade temática</li>
          </ul>
          <p className="mt-3">
            Essa conexão é útil tanto para colaborações quanto para formação de núcleos interdisciplinares.
          </p>
        </Alert>

        {/* O Que os Artigos Revelam Sobre a Produção Científica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Que os Artigos Revelam Sobre a Produção Científica</h2>
          <p>
            Mais do que números, os artigos mostram:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>A maturidade e consistência de uma linha de pesquisa</li>
            <li>A capacidade de inovação e contribuição científica</li>
            <li>A inserção nacional e internacional do pesquisador</li>
            <li>A evolução da carreira acadêmica ao longo dos anos</li>
          </ul>
        </Alert>

        {/* Como Usar os Artigos Para Tomar Decisões */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Como Usar os Artigos Para Tomar Decisões</h2>
          <p>
            A seção de artigos pode orientar:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Escolha de orientadores ou parceiros de pesquisa</li>
            <li>Avaliação de programas de pós-graduação</li>
            <li>Planejamento de publicação com base em tendências</li>
            <li>Composição de relatórios técnicos ou acadêmicos</li>
          </ul>
        </Alert>

        {/* Documentação da API de Artigos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Artigos</h2>

          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar artigos:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/bibliographic_production_article
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
                    <td className="border px-4 py-2">terms</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Termos de busca (palavras-chave, nomes, etc)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">year</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Ano(s) de publicação, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">qualis</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Qualis da revista, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">university</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">Universidade/instituição</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas artigos distintos (sem repetição)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">graduate_program_id</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">ID do programa de pós-graduação</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">dep_id</td>
                    <td className="border px-4 py-2">string</td>
                    <td className="border px-4 py-2">ID do departamento</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/bibliographic_production_article?terms=machine%20learning&amp;year=2022;2023&amp;qualis=A1;A2&amp;distinct=1
              </code>
            </div>

            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um artigo científico. Os principais campos retornados são:
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
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">id</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Identificador do artigo</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">title</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Título do artigo</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">abstract</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Resumo</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">authors</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Lista de autores</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">authors_institution</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Instituição dos autores</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">article_institution</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Instituição do artigo</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">citations_count</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Número de citações</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">issn</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">ISSN da revista</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">keywords</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Palavras-chave</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">landing_page_url</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">URL da página do artigo</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">language</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Idioma</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">pdf</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">URL do PDF</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">doi</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">DOI do artigo</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">name_periodical</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Nome do periódico</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">qualis</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Qualis da revista (A1, A2, ..., SQ, NP)</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">year</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Ano de publicação</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">color</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Cor (para UI)</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">researcher</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Nome do pesquisador principal</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">lattes_id</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">ID Lattes do pesquisador</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">magazine</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Nome da revista</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">lattes_10_id</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">ID Lattes 10</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">jcr_link</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Link JCR</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">jif</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">Fator de impacto JCR</td></tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800"><td className="border px-4 py-2">researcher_id</td><td className="border px-4 py-2">string</td><td className="border px-4 py-2">ID do pesquisador</td></tr>
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