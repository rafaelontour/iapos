import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function Revistas() {
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
              Revistas Científicas
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

        {/* Revistas na {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Revistas</h2>
          <p>
            A {platform} reúne e organiza as revistas científicas nas quais os pesquisadores {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"} publicam seus trabalhos. Essa base consolidada permite visualizar, filtrar e explorar os periódicos utilizados como veículos de divulgação da produção acadêmica, técnica e científica {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "do estado da Bahia"}.
          </p>
          <p className="mt-3">
            A presença dessas revistas na plataforma está diretamente associada aos artigos científicos cadastrados e à avaliação da qualidade das publicações segundo critérios nacionais e internacionais.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada revista registrada na plataforma contém dados essenciais como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>ISSN:</strong> Identificador Internacional de Série</li>
            <li><strong>Título do periódico</strong></li>
            <li><strong>Classificação Qualis:</strong> conforme área de avaliação CAPES</li>
            <li><strong>Presença em bases de impacto:</strong> como Journal Citation Reports (JCR)</li>
          </ul>
          <p className="mt-3">
            Essas informações são apresentadas de forma padronizada, permitindo consultas rápidas, comparações e análises por tipo de revista, área do conhecimento e frequência de uso pelos pesquisadores vinculados à plataforma.
          </p>
        </Alert>

        {/* Classificações Qualis e JCR */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Classificações Qualis e JCR</h2>
          <p>
            As revistas são qualificadas com base em:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Qualis CAPES:</strong> sistema nacional que classifica os periódicos por áreas do conhecimento, com categorias como A1, A2, B1, B2, B3, B4, B5 e C.</li>
            <li><strong>JCR (Journal Citation Reports):</strong> indicador internacional que mensura o fator de impacto e relevância dos periódicos em âmbito global.</li>
          </ul>
          <p className="mt-3">
            Essas classificações ajudam a identificar o prestígio e a qualidade das revistas utilizadas pelos pesquisadores como canais de divulgação científica, servindo como referência para análise institucional e estratégica.
          </p>
        </Alert>

        {/* Busca e Análise de Revistas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Busca e Análise de Revistas</h2>
          <p>
            O sistema permite a busca por:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>ISSN</strong> – para localização direta</li>
            <li><strong>Nome do periódico</strong> – busca textual detalhada</li>
            <li><strong>Classificação Qualis</strong> – por nível de prestígio</li>
            <li><strong>Presença em JCR</strong> – por fator de impacto</li>
          </ul>
          <p className="mt-3">
            Esses filtros facilitam o mapeamento das revistas mais utilizadas por área de conhecimento, contribuindo para estudos sobre padrões editoriais e estratégias de publicação da comunidade científica vinculada à plataforma.
          </p>
        </Alert>

        {/* Relevância para a Ciência */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Relevância para a Ciência</h2>
          <p>
            A análise das revistas cadastradas na {platform} permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Verificar a inserção da produção local</strong> em periódicos de impacto</li>
            <li><strong>Identificar revistas preferidas</strong> por áreas específicas do conhecimento</li>
            <li><strong>Avaliar a qualidade dos canais</strong> de divulgação científica utilizados</li>
            <li><strong>Apoiar programas de pós-graduação</strong> em sua estratégia editorial e de visibilidade</li>
          </ul>
          <p className="mt-3">
            Essa base de dados contribui significativamente para o fortalecimento da cultura de publicação científica qualificada e para o acompanhamento da inserção acadêmica regional em contextos nacionais e internacionais {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Integração com Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Produções</h2>
          <p>
            As revistas estão diretamente vinculadas aos artigos científicos publicados pelos pesquisadores. Cada artigo apresenta o nome do periódico onde foi divulgado, sua classificação Qualis e, quando aplicável, seu fator de impacto JCR.
          </p>
          <p className="mt-3">
            Essa integração permite uma análise completa da produção bibliográfica e dos veículos utilizados para sua circulação, oferecendo um panorama consistente sobre a qualidade e alcance da ciência {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "baiana"}.
          </p>
        </Alert>

        {/* Documentação da API de Texto em revista ou jornal */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Texto em revista ou jornal</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar textos publicados em revistas:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_production/papers_magazine
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
                    <td className="border px-4 py-2">Se 1, retorna apenas textos distintos (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher_production/papers_magazine?year=2022;2023&amp;distinct=1
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um texto publicado em revista. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Página ou link da revista</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">language</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Idioma do texto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">means_divulgation</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Meio de divulgação (nome da revista, periódico, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">nature</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Natureza do texto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">relevance</td>
                      <td className="border px-4 py-2">boolean</td>
                      <td className="border px-4 py-2">Se o texto é considerado relevante</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">scientific_divulgation</td>
                      <td className="border px-4 py-2">boolean</td>
                      <td className="border px-4 py-2">Se é divulgação científica</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título do texto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title_en</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título em inglês</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year_</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de publicação</td>
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