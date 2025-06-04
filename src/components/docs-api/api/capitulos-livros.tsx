import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function CapitulosLivros() {
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
              Capítulos de Livros
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

        {/* Sobre Capítulos de Livros no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Capítulos de Livros na plataforma {platform}</h2>
          <p>
            A seção de Capítulos de Livros na plataforma {platform} apresenta as contribuições dos pesquisadores em obras coletivas. Esses registros refletem a atuação em projetos editoriais colaborativos e a profundidade temática dos conteúdos desenvolvidos em parceria com outros autores ou instituições {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada capítulo de livro registrado no sistema inclui informações como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Título do capítulo</strong></li>
            <li><strong>Nome da obra</strong> na qual está inserido</li>
            <li><strong>Ano de publicação</strong></li>
            <li><strong>Editora responsável</strong></li>
            <li><strong>ISBN da obra</strong></li>
            <li><strong>Autoria vinculada ao pesquisador</strong></li>
          </ul>
          <p className="mt-3">
            Esses dados são exibidos de forma padronizada e interligada ao perfil do pesquisador, permitindo uma análise contextualizada de sua produção bibliográfica.
          </p>
        </Alert>

        {/* Capítulos Como Parte da Produção Acadêmica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Capítulos Como Parte da Produção Acadêmica</h2>
          <p>
            A publicação de capítulos de livros é uma forma relevante de produção científica. Esse tipo de contribuição permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Explorar temas com mais profundidade e liberdade de abordagem</li>
            <li>Participar de discussões interdisciplinares em coletâneas temáticas</li>
            <li>Divulgar resultados de pesquisa em obras organizadas por especialistas</li>
          </ul>
        </Alert>

        {/* Relação com o Perfil do Pesquisador */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Relação com o Perfil do Pesquisador</h2>
          <p>
            Na plataforma {platform}, os capítulos de livros estão diretamente associados ao perfil de cada pesquisador. Isso permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Visualizar a linha temática do pesquisador ao longo do tempo</li>
            <li>Identificar colaborações recorrentes com outros autores</li>
            <li>Reconhecer sua presença em publicações de referência na área</li>
          </ul>
        </Alert>

        {/* Exploração e Filtros por Ano */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Exploração e Filtros por Ano</h2>
          <p>
            A seção de capítulos pode ser explorada com base em filtros por ano de publicação. Essa funcionalidade facilita o acompanhamento da evolução da produção editorial dos pesquisadores ao longo dos anos e auxilia em levantamentos históricos e institucionais.
          </p>
        </Alert>

        {/* Importância dos Capítulos na Avaliação Científica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância dos Capítulos na Avaliação Científica</h2>
          <p>
            Embora não tenham o mesmo peso de indexação que artigos científicos, os capítulos de livros são valorizados por:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Complementarem o currículo com abordagens mais amplas</li>
            <li>Registrarem contribuições em áreas de ensino, extensão ou cultura</li>
            <li>Representarem engajamento com coletivos de pesquisa e formação acadêmica</li>
          </ul>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            Na plataforma {platform}, os capítulos são apresentados junto a outras categorias da produção acadêmica, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Livros completos</strong></li>
            <li><strong>Relatórios técnicos</strong></li>
            <li><strong>Eventos e orientações</strong></li>
          </ul>
          <p className="mt-3">
            Essa integração oferece uma visão completa e contextualizada da atuação intelectual do pesquisador.
          </p>
        </Alert>

        {/* Documentação da API de Capítulos de Livros */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Capítulos de Livros</h2>

          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar capítulos de livros:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/book_chapter_production_researcher
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
                    <td className="border px-4 py-2">Se 1, retorna apenas capítulos distintos (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/book_chapter_production_researcher?year=2022;2023&amp;term=educação&amp;distinct=1
              </code>
            </div>

            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um capítulo de livro. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador do capítulo</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título do capítulo</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de publicação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">isbn</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">ISBN do livro</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">publishing_company</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Editora</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do autor ou organizador</td>
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