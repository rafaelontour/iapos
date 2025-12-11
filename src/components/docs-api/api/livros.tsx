import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function Livros() {
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
              Livros Publicados
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

        {/* Sobre Livros no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Livros na plataforma {platform}</h2>
          <p>
            A seção de Livros da plataforma {platform} apresenta a produção bibliográfica completa registrada pelos pesquisadores {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}, evidenciando suas contribuições como autores ou organizadores de obras completas. Essa seção é parte essencial da visualização da competência científica individual e coletiva.
          </p>
        </Alert>

        {/* Informações Apresentadas na Seção de Livros */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas na Seção de Livros</h2>
          <p>
            Cada obra listada exibe:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Nome do livro</strong></li>
            <li><strong>Ano de publicação</strong></li>
            <li><strong>Editora</strong></li>
            <li><strong>ISBN</strong></li>
            <li><strong>Autor(es) vinculados</strong></li>
          </ul>
          <p className="mt-3">
            Esses dados são extraídos da Plataforma Lattes, com autorização do CNPq, e enriquecidos por outras bases integradas à plataforma {platform}.
          </p>
        </Alert>

        {/* Importância dos Livros na Produção Acadêmica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância dos Livros na Produção Acadêmica</h2>
          <p>
            Os livros publicados por pesquisadores refletem:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Consolidação de conhecimento em determinada área</li>
            <li>Capacidade de organização e aprofundamento temático</li>
            <li>Produção voltada para formação, extensão ou divulgação científica</li>
            <li>Atuação em linhas autorais completas e projetos de longo prazo</li>
          </ul>
          <p className="mt-3">
            Diferente de capítulos, os livros exigem maior fôlego autoral e demonstram autoridade temática consolidada.
          </p>
        </Alert>

        {/* Filtro Por Ano de Publicação */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Filtro Por Ano de Publicação</h2>
          <p>
            O usuário pode selecionar qualquer ano entre 1990 e o atual para visualizar:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Livros publicados naquele ano</li>
            <li>Capítulos associados (opcionalmente)</li>
            <li>Dados organizados em gráficos e listas</li>
          </ul>
          <p className="mt-3">
            Esse recurso permite análises temporais e acompanhamento de tendências editoriais entre os pesquisadores.
          </p>
        </Alert>

        {/* Livros e o Pesquisador */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Livros e o Pesquisador</h2>
          <p>
            A plataforma {platform} apresenta os livros vinculados diretamente ao perfil do pesquisador, permitindo visualizar:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Suas obras como autor principal ou coautor</li>
            <li>O impacto de sua produção no campo de atuação</li>
            <li>Participação como organizador de coletâneas acadêmicas</li>
          </ul>
          <p className="mt-3">
            Essa produção bibliográfica contribui significativamente para os indicadores pessoais de desempenho científico.
          </p>
        </Alert>

        {/* Utilidade da Produção de Livros no Contexto Científico */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Utilidade da Produção de Livros no Contexto Científico</h2>
          <p>
            Os livros são usados como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Referência</strong> para disciplinas e programas de ensino</li>
            <li><strong>Base</strong> para projetos de extensão e formação continuada</li>
            <li><strong>Material de apoio</strong> em ações interdisciplinares ou socioculturais</li>
            <li><strong>Evidência</strong> de trajetória consolidada em determinada área</li>
          </ul>
        </Alert>

        {/* Integração com Capítulos e Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Capítulos e Outras Produções</h2>
          <p>
            A seção de livros se conecta naturalmente com outras categorias da plataforma {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Capítulos de livros</strong></li>
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Relatórios técnicos</strong></li>
            <li><strong>Orientações e eventos</strong></li>
          </ul>
          <p className="mt-3">
            Isso permite uma visualização completa da produção bibliográfica do pesquisador dentro e fora do ambiente editorial.
          </p>
        </Alert>

        {/* Documentação da API de Livros */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Livros</h2>
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar livros:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/book_production_researcher
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
                    <td className="border px-4 py-2">Se 1, retorna apenas livros distintos (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/book_production_researcher?year=2022;2023&amp;term=educação&amp;distinct=1
              </code>
            </div>

            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um livro. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador do livro</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título do livro</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de publicação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">publishing_company</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Editora</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">isbn</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">ISBN do livro</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">authors</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Autor(es) vinculados</td>
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
