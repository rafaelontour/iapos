import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function Marca() {
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
              Marcas Registradas
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

        {/* Sobre Marcas no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Marcas na plataforma {platform}</h2>
          <p>
            A seção de Marcas na plataforma {platform} reúne os registros de propriedade intelectual relacionados à criação de identidades visuais, nomes institucionais, sistemas, produtos ou serviços desenvolvidos por pesquisadores {platform === "Conectee" ? "da Escola de Engenharia da UFMG" : "das instituições públicas da Bahia"}. Essas marcas refletem o elo entre a produção científica e sua materialização em iniciativas com identidade própria.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Para cada marca registrada, a plataforma {platform} apresenta:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Nome da marca</strong></li>
            <li><strong>Ano de registro ou submissão</strong></li>
            <li><strong>Autor(a) vinculado</strong> ao desenvolvimento</li>
            <li><strong>Tipo ou classificação:</strong> como marca comercial, serviço ou coletiva</li>
          </ul>
          <p className="mt-3">
            Esses dados são organizados de forma padronizada e vinculados ao perfil do pesquisador, permitindo uma análise clara e contextualizada de sua produção técnica e inovadora.
          </p>
        </Alert>

        {/* Filtros Temporais e Análise Visual */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Filtros Temporais e Análise Visual</h2>
          <p>
            A seção permite aplicar filtros por ano, com gráficos que mostram:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>O registro de marcas ao longo do tempo</li>
            <li>Tendências de desenvolvimento de identidades e soluções institucionais</li>
            <li>Crescimento de iniciativas com potencial de inovação aplicada</li>
          </ul>
          <p className="mt-3">
            Essas visualizações apoiam análises estratégicas e contribuem para compreender o papel dos pesquisadores no fortalecimento da marca científica e tecnológica.
          </p>
        </Alert>

        {/* Importância das Marcas na Produção Científica e Técnica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância das Marcas na Produção Científica e Técnica</h2>
          <p>
            O registro de marcas revela uma dimensão diferenciada da atuação do pesquisador, refletindo:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>O desenvolvimento de soluções reconhecíveis,</strong> aplicáveis e replicáveis</li>
            <li><strong>A criação de plataformas, metodologias ou sistemas nomeados</strong>, com identidade própria</li>
            <li><strong>O envolvimento com projetos de transferência de tecnologia,</strong> extensão ou empreendedorismo científico</li>
          </ul>
          <p className="mt-3">
            Essas produções ajudam a consolidar o impacto prático da ciência desenvolvida na plataforma {platform}, conectando pesquisa e sociedade por meio de identidade, proteção legal e visibilidade institucional.
          </p>
        </Alert>

        {/* O Pesquisador como Criador de Identidade Tecnológica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador como Criador de Identidade Tecnológica</h2>
          <p>
            A presença de marcas no perfil do pesquisador evidencia sua contribuição para:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>O desenvolvimento de novos serviços</strong> ou estruturas organizacionais</li>
            <li><strong>A estruturação de projetos com identidade visual própria</strong>, facilitando sua divulgação e uso</li>
            <li><strong>O avanço de práticas inovadoras associadas a nomes</strong> institucionais ou comunitários</li>
          </ul>
          <p className="mt-3">
            Essa produção também demonstra o alinhamento entre ciência, inovação e impacto social, evidenciando um perfil engajado com aplicações concretas do conhecimento.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            As marcas são exibidas junto a outras categorias na plataforma {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Patentes</strong> – por compartilharem a categoria de propriedade intelectual</li>
            <li><strong>Softwares</strong> – frequentemente relacionados a produtos tecnológicos</li>
            <li><strong>Projetos de pesquisa</strong> – como parte de iniciativas mais amplas</li>
            <li><strong>Relatórios técnicos</strong> – para registrar o desenvolvimento</li>
            <li><strong>Produtos de extensão</strong> – quando voltados ao público final</li>
          </ul>
          <p className="mt-3">
            Essa integração permite compreender como a marca é parte de um processo mais amplo de desenvolvimento científico e tecnológico, agregando valor às iniciativas do pesquisador.
          </p>
        </Alert>

        {/* Documentação da API de Marcas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Marcas</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar marcas registradas:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/marca_production_researcher
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
                    <td className="border px-4 py-2">Ano(s) de registro, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas marcas distintas (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/marca_production_researcher?year=2022;2023&amp;distinct=1
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando uma marca registrada. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador da marca</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome da marca</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano de registro</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">name</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do autor ou responsável</td>
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