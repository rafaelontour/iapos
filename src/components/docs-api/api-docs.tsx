import { Alert } from "../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserContext } from "../../context/context";
import { Code, Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../gerVersion";
import bg_popup from "../../assets/bg_home.png";
import { Helmet } from "react-helmet";

export function ApiDocs() {
  const { version } = useContext(UserContext);
  const platform = version ? "Conectee" : "Simcc";
  const version2 = getVersion();

  return (
    <main className="p-4 md:p-8 bg-neutral-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
        <Helmet>
          <title>Apresentação da API | {version ? ('Conectee'):('Simcc')}</title>
          <meta name="description" content={`Apresentação da API | ${version ? ('Conectee'):('Simcc')}`} />
          <meta name="robots" content="index, follow" />
        </Helmet>

      <div className="max-w-[936px] mx-auto space-y-8">
        {/* Header */}
        <Alert className="p-0">
          <div className="flex border-0 rounded-b-none justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6 rounded-md">
            <span className="text-base font-medium text-gray-600 dark:text-gray-300">
              Documentação da API
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

        {/* Introdução à API */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Introdução à API</h2>
          <p className="text-justify">
            A API da plataforma {platform} oferece acesso programático aos dados científicos e acadêmicos de pesquisadores, instituições e produções científicas, permitindo integrações com outras plataformas, análises personalizadas e visualizações customizadas dos indicadores de ciência, tecnologia e inovação.
          </p>
          <p className="mt-3 text-justify">
            Projetada com foco em flexibilidade e facilidade de uso, a API permite consultas detalhadas sobre publicações, pesquisadores, patentes, softwares, e outras produções acadêmicas, retornando dados estruturados em formato JSON para integração imediata em aplicativos e sistemas de análise.
          </p>
        </Alert>


        {/* Requisitos e Acesso */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Requisitos e Acesso</h2>
          <p>
            A API está disponível para consultas públicas, sem necessidade de autenticação para endpoints básicos. Para endpoints mais avançados ou alta frequência de requisições, podem ser aplicadas limitações de taxa de acesso.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>URL Base:</strong> {version ? ('https://conectee.eng.ufmg.br/api'):('https://simcc.uesc.br/api')}</li>
            <li><strong>Formato de Resposta:</strong> JSON</li>
            <li><strong>Métodos Suportados:</strong> GET</li>
            <li><strong>CORS:</strong> Habilitado para integrações com aplicações web</li>
          </ul>
          <p className="mt-3">
            Para projetos com necessidades específicas de volume ou acesso a dados personalizados, entre em contato com a equipe de suporte.
          </p>
        </Alert>


        {/* Formato das Respostas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Formato das Respostas</h2>
          <p>
            Todas as respostas são retornadas em formato JSON, seguindo estas convenções:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2">
            <pre className="text-sm overflow-auto">
              <code>
                {`// Exemplo de resposta para uma consulta de artigos
[
  {
    "id": "10.1234/example.123",
    "title": "Título do artigo científico",
    "authors": "Silva, J.; Santos, M.",
    "year_": "2023",
    "journal": "Journal of Science",
    "qualis": "A1",
    "jcr": "3.456"
  },
  // Mais itens...
]`}
              </code>
            </pre>
          </div>
          <p className="mt-3">
            Os arrays vazios indicam que nenhum resultado foi encontrado para a consulta. Erros de requisição retornam códigos HTTP apropriados (400, 404, 500) com mensagens explicativas quando aplicável.
          </p>
        </Alert>

        {/* Exemplos de Uso */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Exemplos de Uso</h2>
          <p>
            Abaixo estão alguns exemplos práticos de como utilizar a API em diferentes cenários:
          </p>
          <div className="space-y-4 mt-3">
            <div>
              <h3 className="font-semibold">Obter todos os artigos a partir de um ano:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mt-1">
                GET https://conectee.eng.ufmg.br/api/researcher_production/articles?year=2023
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Listar pesquisadores de uma área específica:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mt-1">
                GET https://conectee.eng.ufmg.br/api/researcher?area=Engenharia
              </code>
            </div>
            <div>
              <h3 className="font-semibold">Consultar orientações de um pesquisador:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mt-1">
                GET https://conectee.eng.ufmg.br/api/guidance_researcher?researcher_id=123456
              </code>
            </div>
          </div>
          <p className="mt-3">
            Consulte as seções específicas da documentação para exemplos mais detalhados de cada endpoint.
          </p>
        </Alert>

        {/* Boas Práticas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Boas Práticas</h2>
          <p>
            Para obter o melhor desempenho e evitar problemas ao utilizar a API, recomendamos:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Filtre suas consultas</strong> - Utilize parâmetros para limitar o volume de dados retornados</li>
            <li><strong>Implemente cache</strong> - Armazene resultados frequentes para reduzir chamadas repetidas</li>
            <li><strong>Respeite os limites de taxa</strong> - Evite requisições excessivas em curtos períodos</li>
            <li><strong>Verifique erros</strong> - Sempre implemente tratamento de erros para códigos HTTP não-200</li>
            <li><strong>Documente suas integrações</strong> - Mantenha registro de como sua aplicação utiliza a API</li>
          </ul>
          <p className="mt-3">
            Seguir essas práticas garantirá uma experiência mais estável e eficiente ao consumir os dados da API.
          </p>
        </Alert>

        {/* Documentação Específica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação Específica</h2>
          <p>
            Cada categoria de dados possui sua própria página de documentação detalhada, que você pode acessar através do menu lateral. Estas páginas incluem:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Endpoints específicos</strong> - URLs completas para cada tipo de consulta</li>
            <li><strong>Parâmetros aceitos</strong> - Opções de filtro específicas para cada recurso</li>
            <li><strong>Estrutura de resposta</strong> - Campos retornados e seus significados</li>
            <li><strong>Exemplos práticos</strong> - Casos de uso com código de exemplo</li>
          </ul>
          <p className="mt-3">
            Navegue pelo menu para explorar em detalhes cada conjunto de dados disponível através da API.
          </p>
        </Alert>
      </div>
    </main>
  );
}