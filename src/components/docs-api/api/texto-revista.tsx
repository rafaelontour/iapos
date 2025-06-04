import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function TextoRevista() {
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
              Texto em revista ou jornais
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

        {/* Sobre Texto em revista ou jornal na {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Texto em revista ou jornal no {platform}</h2>
          <p>
            A seção de Texto em revista ou jornal da {platform} apresenta publicações de caráter científico, opinativo, educacional ou de divulgação que os pesquisadores produziram para revistas, jornais e outros meios editoriais voltados ao público geral ou especializado {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
          <p className="mt-3">
            Essa produção é importante para ampliar o diálogo entre a ciência e a sociedade, tornando o conhecimento acessível, relevante e socialmente engajado.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada Texto em revista ou jornal registrado é exibido com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título da publicação</strong></li>
            <li><strong>Nome da revista,</strong> periódico ou veículo editorial</li>
            <li><strong>Nome do(s) autor(es)</strong></li>
            <li><strong>Ano de publicação</strong></li>
          </ul>
          <p className="mt-3">
            Essas informações são organizadas de maneira padronizada, facilitando o reconhecimento da autoria e o vínculo direto com o perfil do pesquisador.
          </p>
        </Alert>

        {/* Filtro Temporal e Visualização por Ano */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Filtro Temporal e Visualização por Ano</h2>
          <p>
            A plataforma permite consultar textos publicados em revistas a partir de filtros por ano, além de apresentar gráficos que mostram:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>A evolução da produção ao longo do tempo</li>
            <li>Tendências temáticas de publicação</li>
            <li>Picos e variações na participação dos pesquisadores nesse tipo de veículo</li>
          </ul>
          <p className="mt-3">
            Essa organização favorece análises qualitativas e quantitativas da produção editorial não acadêmica formal.
          </p>
        </Alert>

        {/* Importância dos Texto em revista ou jornal na Produção Científica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância dos Texto em revista ou jornal na Produção Científica</h2>
          <p>
            Essa categoria reflete o esforço do pesquisador em:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Tornar seus conhecimentos mais acessíveis</strong> a diferentes públicos</li>
            <li><strong>Atuar em espaços de divulgação científica</strong> e formação de opinião</li>
            <li><strong>Contribuir para o debate público,</strong> educação e extensão universitária</li>
          </ul>
          <p className="mt-3">
            Esses textos complementam a produção científica tradicional, estabelecendo pontes entre academia, mídia e sociedade.
          </p>
        </Alert>

        {/* O Pesquisador e a Produção de Texto em revista ou jornal */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador e a Produção de Texto em revista ou jornal</h2>
          <p>
            A presença de Texto em revista ou jornais no perfil do pesquisador demonstra:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Comprometimento com a comunicação pública da ciência</strong></li>
            <li><strong>Atuação em espaços editoriais diversos</strong>, incluindo revistas institucionais, jornais e veículos independentes</li>
            <li><strong>Capacidade de traduzir conhecimento científico</strong> para públicos ampliados e não especializados</li>
          </ul>
          <p className="mt-3">
            Essa produção reforça o papel do pesquisador como agente de transformação social e cultural, conectando ciência e cotidiano.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            Texto em revista ou jornal são exibidos junto a outras categorias de produção na {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Livros e capítulos</strong></li>
            <li><strong>Patentes e softwares</strong></li>
            <li><strong>Relatórios técnicos</strong></li>
            <li><strong>Eventos e orientações acadêmicas</strong></li>
          </ul>
          <p className="mt-3">
            Essa abordagem integrada permite uma leitura ampla da atuação intelectual e comunicacional do pesquisador, evidenciando tanto a produção técnica quanto a dimensão social e formativa de seu trabalho {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Documentação da API de Texto em revista ou jornal */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Texto em revista ou jornal</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar Texto em revista ou jornal:</h3>
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
                A resposta é um array de objetos, cada um representando um Texto em revista ou jornal. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Página ou link do texto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">language</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Idioma do texto</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">means_divulgation</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Meio de divulgação (nome da revista, jornal, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">nature</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Natureza do texto (científico, opinativo, etc.)</td>
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