import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function BolsistasCnpq() {
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
              Bolsistas CNPq
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

        {/* Sobre os Bolsistas CNPq no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre os Bolsistas CNPq na plataforma {platform}</h2>
          <p>
            Os bolsistas CNPq na plataforma {platform} são pesquisadores que recebem bolsas de produtividade em pesquisa ou em desenvolvimento tecnológico e extensão inovadora, concedidas pelo Conselho Nacional de Desenvolvimento Científico e Tecnológico. Esses reconhecimentos representam um importante indicador de excelência acadêmica, liderança em suas áreas de atuação e impacto científico {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada pesquisador bolsista no sistema é apresentado com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Nome completo</strong></li>
            <li><strong>Situação da bolsa:</strong> ativa</li>
            <li><strong>Área de conhecimento vinculada</strong></li>
            <li><strong>Categoria da bolsa concedida</strong></li>
          </ul>
          <p className="mt-3">
            As informações são organizadas de forma padronizada, com filtros por área e categoria, permitindo análises por perfil, campo de atuação e distribuição institucional.
          </p>
        </Alert>

        {/* Categorias de Bolsa */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Categorias de Bolsa</h2>
          <p>
            As bolsas de produtividade em pesquisa são classificadas em níveis que indicam a trajetória, impacto e regularidade da produção científica do pesquisador. As categorias vão desde o nível 2 até os níveis 1D, 1C, 1B, 1A e SR (Sênior), que representam patamares progressivos de reconhecimento.
          </p>
          <p className="mt-3">
            Também são mapeadas as bolsas voltadas para desenvolvimento tecnológico e extensão inovadora, indicando a atuação aplicada do pesquisador na criação de soluções para demandas sociais, econômicas ou ambientais.
          </p>
        </Alert>

        {/* Visualização e Análise */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Visualização e Análise</h2>
          <p>
            A plataforma {platform} permite:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Visualizar a distribuição geográfica</strong> dos bolsistas {platform === "Conectee" ? "em Minas Gerais, com foco na Escola de Engenharia da UFMG" : "no mapa da Bahia"}</li>
            <li><strong>Consultar gráficos por categoria de bolsa</strong> (produtividade e desenvolvimento tecnológico)</li>
            <li><strong>Analisar a representatividade por área do conhecimento</strong></li>
          </ul>
          <p className="mt-3">
            Essas ferramentas possibilitam identificar polos de excelência, áreas estratégicas de atuação e pesquisadores com trajetórias destacadas na ciência nacional.
          </p>
        </Alert>

        {/* Reconhecimento e Impacto */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Reconhecimento e Impacto</h2>
          <p>
            O status de bolsista CNPq reconhece a relevância do pesquisador em sua área, refletindo:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Produção científica consistente</strong> e de alto impacto</li>
            <li><strong>Participação ativa na formação</strong> de recursos humanos</li>
            <li><strong>Liderança em projetos de pesquisa,</strong> inovação e desenvolvimento tecnológico</li>
            <li><strong>Inserção qualificada em redes</strong> nacionais e internacionais de pesquisa</li>
          </ul>
          <p className="mt-3">
            Esse reconhecimento também contribui para a visibilidade institucional e serve como referência em processos de avaliação acadêmica e científica.
          </p>
        </Alert>

        {/* Integração com o Perfil do Pesquisador */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com o Perfil do Pesquisador</h2>
          <p>
            As bolsas CNPq estão integradas ao perfil geral do pesquisador na plataforma {platform}, complementando outras categorias como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Produções bibliográficas e técnicas</strong></li>
            <li><strong>Projetos de pesquisa</strong></li>
            <li><strong>Orientações acadêmicas</strong></li>
            <li><strong>Participações em eventos e grupos</strong></li>
          </ul>
          <p className="mt-3">
            Essa visão integrada permite uma leitura completa da trajetória científica dos bolsistas, valorizando sua contribuição para o avanço da ciência na plataforma {platform} e no Brasil.
          </p>
        </Alert>
        
        {/* Documentação da API de Bolsistas CNPq */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Bolsistas CNPq</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar bolsistas CNPq:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher/foment
              </code>
            </div>
        
            {/* Filtros Disponíveis */}
            <div>
              <h3 className="font-semibold">Filtros Disponíveis</h3>
              <p className="text-sm text-gray-500 mb-2">
                O endpoint pode aceitar parâmetros de busca, como nome, área, cidade, universidade, entre outros, conforme a implementação do backend.
              </p>
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
                    <td className="border px-4 py-2">Termo de busca (nome, área, etc.)</td>
                  </tr>
                  {/* Adicione outros filtros se o backend suportar */}
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/researcher/foment?terms=biologia
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando um pesquisador bolsista. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador do pesquisador</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome completo</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">university</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Universidade de vínculo</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">area</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Área de conhecimento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">city</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Cidade</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">graduation</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Titulação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">subsidy</td>
                      <td className="border px-4 py-2">array</td>
                      <td className="border px-4 py-2">Lista de bolsas CNPq (detalhes abaixo)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">graduate_programs</td>
                      <td className="border px-4 py-2">array</td>
                      <td className="border px-4 py-2">Programas de pós-graduação vinculados</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">departments</td>
                      <td className="border px-4 py-2">array</td>
                      <td className="border px-4 py-2">Departamentos de vínculo</td>
                    </tr>
                    {/* Adicione outros campos relevantes conforme necessário */}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                <strong>Detalhes do campo <code>subsidy</code>:</strong>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-sm mt-2">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border px-4 py-2 text-left">Campo</th>
                      <th className="border px-4 py-2 text-left">Tipo</th>
                      <th className="border px-4 py-2 text-left">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">modality_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Modalidade da bolsa (PQ, DT, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">category_level_code</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Categoria/Nível da bolsa (1A, 1B, 2, SR, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">funding_program_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do programa de fomento</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">institute_name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Instituição concedente</td>
                    </tr>
                    {/* Adicione outros campos do objeto Bolsistas se necessário */}
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