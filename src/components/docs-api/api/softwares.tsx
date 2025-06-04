import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function SoftwareInfos() {
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
              Softwares Desenvolvidos
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

        {/* Sobre Softwares na {platform} */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Softwares no {platform}</h2>
          <p>
            A seção de Softwares da {platform} destaca as produções tecnológicas registradas pelos pesquisadores, evidenciando sua atuação na criação de ferramentas, sistemas e soluções digitais com finalidade científica, educacional, analítica ou social. Essa forma de produção técnica representa uma vertente inovadora e crescente dentro da pesquisa acadêmica {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada software cadastrado no sistema é apresentado com os seguintes dados:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Nome do software</strong></li>
            <li><strong>Tipo de registro</strong></li>
            <li><strong>Ano de publicação ou disponibilização</strong></li>
            <li><strong>Nome do(s) desenvolvedor(es) vinculado(s)</strong></li>
          </ul>
          <p className="mt-3">
            As informações são organizadas em uma estrutura padronizada, facilitando o reconhecimento da autoria e a vinculação ao perfil do pesquisador.
          </p>
        </Alert>

        {/* Filtro Temporal e Gráficos */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Filtro Temporal e Gráficos</h2>
          <p>
            O sistema permite filtrar os softwares por ano, o que possibilita:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Acompanhamento da evolução da produção digital</li>
            <li>Identificação de períodos de maior atividade tecnológica</li>
            <li>Análises institucionais ou por área de atuação</li>
          </ul>
          <p className="mt-3">
            Gráficos visuais auxiliam na leitura e compreensão dessas tendências ao longo do tempo.
          </p>
        </Alert>

        {/* O Papel dos Softwares no Perfil do Pesquisador */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Papel dos Softwares no Perfil do Pesquisador</h2>
          <p>
            O desenvolvimento de softwares reflete uma dimensão técnica e aplicada da atuação científica. Na {platform}, isso evidencia que o pesquisador:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Transforma conhecimento teórico em soluções práticas</li>
            <li>Atua em projetos interdisciplinares de base tecnológica</li>
            <li>Contribui com a criação de ferramentas de uso acadêmico, social ou institucional</li>
          </ul>
          <p className="mt-3">
            Essa produção amplia o escopo da pesquisa e fortalece a integração entre ciência, tecnologia e sociedade {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Utilidade e Impacto dos Softwares */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Utilidade e Impacto dos Softwares</h2>
          <p>
            Os softwares registrados indicam um potencial de impacto real, pois:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Ajudam a resolver problemas complexos por meio da tecnologia</li>
            <li>Podem ser aplicados em ensino, pesquisa, gestão pública ou iniciativas sociais</li>
            <li>Representam inovação, originalidade e capacidade de implementação</li>
          </ul>
          <p className="mt-3">
            Esses elementos são valorizados tanto em avaliações científicas quanto na busca por financiamento e parcerias tecnológicas.
          </p>
        </Alert>

        {/* Integração com Outras Categorias de Produção */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Categorias de Produção</h2>
          <p>
            A produção de softwares é apresentada junto com outras categorias técnicas e bibliográficas na {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Patentes</strong></li>
            <li><strong>Artigos científicos</strong></li>
            <li><strong>Livros e capítulos</strong></li>
            <li><strong>Eventos e orientações</strong></li>
          </ul>
          <p className="mt-3">
            Essa integração oferece uma visão completa da atuação científica e tecnológica dos pesquisadores, mostrando como suas contribuições se conectam em diferentes formatos de produção intelectual {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Documentação da API de Softwares */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Softwares</h2>

          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar softwares:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/software_production_researcher
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
                    <td className="border px-4 py-2">Se 1, retorna apenas softwares distintos (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/software_production_researcher?year=2022;2023&amp;distinct=1
              </code>
            </div>

            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um software. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador do software</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do software</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de publicação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do pesquisador ou autor principal</td>
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