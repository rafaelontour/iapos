import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { UserContext } from "../../../context/context";
import { Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../../gerVersion";
import bg_popup from "../../../assets/bg_home.png";

export function Orientacoes() {
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
              Orientações Acadêmicas
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

        {/* Sobre Orientações no SIMCC */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Sobre Orientações na plataforma {platform}</h2>
          <p>
            A seção de Orientações na plataforma {platform} apresenta o conjunto de atividades de orientação realizadas por pesquisadores no contexto da formação acadêmica. Essa produção evidencia o compromisso com o desenvolvimento de novos talentos científicos, o fortalecimento dos programas de ensino e a contribuição direta para a qualificação técnica e intelectual de estudantes em diversos níveis {platform === "Conectee" ? "na Escola de Engenharia da UFMG" : "nas instituições públicas da Bahia"}.
          </p>
        </Alert>

        {/* Informações Apresentadas */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Informações Apresentadas</h2>
          <p>
            Cada orientação registrada na plataforma apresenta dados como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Nome da pessoa orientada</strong></li>
            <li><strong>Título do trabalho</strong> ou projeto orientado</li>
            <li><strong>Tipo de orientação:</strong> iniciação científica, graduação, mestrado, doutorado, especialização, pós-doutorado ou outros</li>
            <li><strong>Situação da orientação:</strong> concluída ou em andamento</li>
            <li><strong>Ano de referência</strong></li>
          </ul>
          <p className="mt-3">
            Essas informações são associadas diretamente ao perfil do pesquisador e organizadas de forma padronizada, possibilitando uma análise clara e contextualizada de sua atuação formativa.
          </p>
        </Alert>

        {/* Visualização Temporal e Por Tipo */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Visualização Temporal e Por Tipo</h2>
          <p>
            A plataforma permite filtrar as orientações por ano e exibe gráficos que mostram:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>A evolução das orientações ao longo do tempo</li>
            <li>A distribuição por tipo de orientação (IC, Mestrado, Doutorado etc)</li>
            <li>A intensidade da atuação formativa dos pesquisadores</li>
          </ul>
          <p className="mt-3">
            Esses dados apoiam tanto o reconhecimento individual quanto a avaliação institucional do papel docente e formativo no ecossistema científico da plataforma {platform}.
          </p>
        </Alert>

        {/* Importância das Orientações na Atuação Acadêmica */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Importância das Orientações na Atuação Acadêmica</h2>
          <p>
            As orientações refletem o papel ativo do pesquisador na formação de novos profissionais e pesquisadores, demonstrando:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Envolvimento com o ensino</strong> e a formação acadêmica</li>
            <li><strong>Participação em programas de:</strong> graduação, pós-graduação e iniciação científica</li>
            <li><strong>Compromisso com projetos aplicados</strong> e pesquisas reais</li>
          </ul>
          <p className="mt-3">
            Esse tipo de produção é um dos principais indicadores de atuação docente em instituições de ensino superior e uma dimensão essencial da responsabilidade educativa do pesquisador.
          </p>
        </Alert>

        {/* O Pesquisador como Formador */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">O Pesquisador como Formador</h2>
          <p>
            A presença de orientações no perfil do pesquisador indica que ele:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Atua na formação direta de estudantes,</strong> desde os primeiros anos até níveis avançados</li>
            <li><strong>Contribui com a consolidação de programas acadêmicos</strong> e linhas de pesquisa institucionais</li>
            <li><strong>Garante a continuidade e renovação</strong> das áreas de estudo mais relevantes</li>
            <li><strong>Participa ativamente da construção do conhecimento coletivo</strong>, integrando ensino e pesquisa</li>
          </ul>
          <p className="mt-3">
            Esse trabalho também fortalece os laços entre ciência, educação e extensão universitária, ampliando o impacto social e acadêmico da atuação do pesquisador.
          </p>
        </Alert>

        {/* Integração com Outras Produções */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Integração com Outras Produções</h2>
          <p>
            As orientações são exibidas ao lado de outras categorias relevantes na plataforma {platform}, como:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Artigos científicos</strong> – muitas vezes fruto de orientações</li>
            <li><strong>Livros e capítulos</strong> – escritos conjuntamente ou vinculados a dissertações/teses</li>
            <li><strong>Trabalhos em eventos</strong> – participações apoiadas pelo orientador</li>
            <li><strong>Relatórios técnicos, patentes e softwares</strong> – produtos de orientações</li>
            <li><strong>Projetos de pesquisa</strong> – onde frequentemente estão vinculados bolsistas</li>
          </ul>
          <p className="mt-3">
            Essa integração mostra como a atuação formativa está conectada a todas as dimensões da produção científica e técnica, consolidando o pesquisador como agente fundamental na formação acadêmica e na continuidade do ciclo do conhecimento.
          </p>
        </Alert>

        {/* Documentação da API de Orientações */}
        <Alert className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold">Documentação da API de Orientações</h2>
        
          <div className="space-y-4">
            {/* Endpoint */}
            <div>
              <h3 className="font-semibold">Utilize o endpoint abaixo para consultar orientações:</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/guidance_researcher
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
                    <td className="border px-4 py-2">Ano(s) da orientação, separados por ponto e vírgula (;)</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2">distinct</td>
                    <td className="border px-4 py-2">0 ou 1</td>
                    <td className="border px-4 py-2">Se 1, retorna apenas orientações distintas (sem repetição)</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            {/* Exemplo de Requisição */}
            <div>
              <h3 className="font-semibold">Exemplo de Requisição</h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                GET https://conectee.eng.ufmg.br/api/guidance_researcher?year=2022;2023&amp;distinct=1
              </code>
            </div>
        
            {/* Campos Retornados na Resposta */}
            <div>
              <h3 className="font-semibold">Campos Retornados na Resposta</h3>
              <p className="text-sm text-gray-500 mb-2">
                A resposta é um array de objetos, cada um representando uma orientação. Os principais campos retornados são:
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
                      <td className="border px-4 py-2">Identificador da orientação</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">nature</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Natureza da orientação (mestrado, doutorado, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">oriented</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Nome do orientando</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">status</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Situação (em andamento, concluída, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">title</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Título do trabalho orientado</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">type</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Tipo de orientação (principal, coorientação, etc.)</td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2">year</td>
                      <td className="border px-4 py-2">string</td>
                      <td className="border px-4 py-2">Ano da orientação</td>
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