import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft, Home } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Alert, AlertTitle } from "../ui/alert";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { UserContext } from "../../context/context";
import { getVersion } from "../../gerVersion";
import bg_popup from '../../assets/bg_popup.png';

export function IndicePesquisador() {
      const history = useNavigate();

      const location = useLocation();
      const navigate = useNavigate();
    
         const handleVoltar = () => {
           
            const currentPath = location.pathname;
            const hasQueryParams = location.search.length > 0;
            
            if (hasQueryParams) {
              // Se tem query parameters, remove apenas eles
              navigate(currentPath);
            } else {
              // Se não tem query parameters, remove o último segmento do path
              const pathSegments = currentPath.split('/').filter(segment => segment !== '');
              
              if (pathSegments.length > 1) {
                pathSegments.pop();
                const previousPath = '/' + pathSegments.join('/');
                navigate(previousPath);
              } else {
                // Se estiver na raiz ou com apenas um segmento, vai para raiz
                navigate('/');
              }
            }
          };

          const researchers = [
            {
              level: "A+",
              phdYears: "≥ 10",
              academicProduction: "A + L + CL ≥ 5 (mínimo 2 A1)",
              pgExperience: "≥ 4 Doutorados",
              combinedRule: "≥ 1 A1 + ≥ 1 patente",
            },
            {
              level: "A",
              phdYears: "≥ 10",
              academicProduction: "A + L + CL ≥ 5 (mínimo 1 A1)",
              pgExperience: "≥ 2 Doutorados",
              combinedRule: "≥ 1 patente",
            },
            {
              level: "B+",
              phdYears: "≥ 8",
              academicProduction: "A + L + CL ≥ 4 (Mínimo 2 AA)",
              pgExperience: "≥ 2 Mestrados ou ≥ 1 Doutorado",
              combinedRule: "≥ 1 A* + (≥ 1 patente ou ≥ 3 softwares)",
            },
            {
              level: "B",
              phdYears: "≥ 8",
              academicProduction: "A + L + CL ≥ 4 (Mínimo 1 AA)",
              pgExperience: "≥ 2 Mestrados ou ≥ 1 Doutorado",
              combinedRule: "≥ 1 patente ou ≥ 3 softwares",
            },
            {
              level: "C+",
              phdYears: "≥ 6",
              academicProduction: "A + L + CL ≥ 3 (Mínimo 2 AA)",
              pgExperience: "≥ 1 Mestrado ou 1 Doutorado",
              combinedRule: "≥ 1 A* + (≥ 1 patente ou ≥ 3 softwares)",
            },
            {
              level: "C",
              phdYears: "≥ 6",
              academicProduction: "A + L + CL ≥ 3 (Mínimo 1 AA)",
              pgExperience: "≥ 1 Mestrado ou ≥ 1 Doutorado",
              combinedRule: "≥ 1 patente ou ≥ 3 softwares",
            },
            {
              level: "D+",
              phdYears: "≥ 3",
              academicProduction: "A + L + CL ≥ 2 (Mínimo 1 AA)",
              pgExperience: "-",
              combinedRule: "≥ 1 patente ou ≥ 3 softwares",
            },
            {
              level: "D",
              phdYears: "≥ 3",
              academicProduction: "A + L + CL ≥ 2 (Mínimo 1 AA)",
              pgExperience: "-",
              combinedRule: "≥ 1 patente ou ≥ 3 softwares",
            },
            {
              level: "E+",
              phdYears: "< 3",
              academicProduction: "A + L + CL ≥ 1",
              pgExperience: "-",
              combinedRule: "≥ 1 A* ou ≥ 1 patente ou ≥ 3 softwares",
            },
            {
              level: "E",
              phdYears: "-",
              academicProduction: "-",
              pgExperience: "-",
              combinedRule: "Todos que não foram classificados",
            },
          ];

          const classificationColors = {
            "A+": "bg-green-500",
            A: "bg-green-400",
            "B+": "bg-yellow-400",
            B: "bg-yellow-300",
            "C+": "bg-orange-400",
            C: "bg-orange-300",
            "D+": "bg-red-400",
            D: "bg-red-300",
            "E+": "bg-gray-400",
            E: "bg-gray-300",
          };
          const {version} = useContext(UserContext)
              const platform = version ? "Conectee" : "Simcc";
                 const version2 = getVersion();

    return(
      <main className="p-4 md:p-8 bg-neutral-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
       
           <Helmet>
          <title>Índice do pesquisador | {version ? ('Conectee'):('Simcc')}</title>
          <meta name="description" content={`Índice do pesquisador | ${version ? ('Conectee'):('Simcc')}`} />
          <meta name="robots" content="index, follow" />
        </Helmet>

        <div className="max-w-[936px] mx-auto space-y-8">
           {/* Header */}
           <Alert className="p-0">
          <Alert className="flex border-0 rounded-b-none justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6 rounded-md">
            <AlertTitle className="text-base font-medium text-gray-600 dark:text-gray-300">
              Informações
            </AlertTitle>
            <Link to="/">
              <Button variant="outline">
                <Home size={16} className="mr-2" />
                Página Inicial
              </Button>
            </Link>
          </Alert>

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

        <Alert className="space-y-4 p-8">
  <h2 className="text-2xl font-semibold">1. Informações</h2>

  <p className="text-justify">
  A Tabela 1 apresenta os parâmetros utilizados para classificar os pesquisadores
em níveis que variam de E (mais baixo) a A+ (mais alto). Sendo realizada por meio de
uma análise multicritério que considera o tempo desde a conclusão do doutorado, a
produção acadêmica e técnica, além da experiência do pesquisador em programas de
pós-graduação Stricto Sensu.
  </p>

  <p className="text-justify">
  A definição multicritério dos parâmetros apresentados na Tabela 1 foi fundamentada em documentos oficiais que orientam a avaliação da produção acadêmica e tecnológica no Brasil. Entre as referências utilizadas, destacam-se: 
  a) o Documento de Área da CAPES para a área 45 (Interdisciplinar); 
  b) a Chamada Pública CNPq 04/2021 para Bolsas de Produtividade em Pesquisa (PQ), que valoriza pesquisadores com produção científica e tecnológica de destaque; 
  c) a Chamada CNPq 05/2021 para Bolsas de Produtividade Sênior (PQ-Sr), que reconhece líderes em suas áreas de atuação; 
  d) a Chamada CNPq 04/2023 para Bolsas de Desenvolvimento Tecnológico e Extensão Inovadora (DT), que enfatiza a participação em ações de inovação e desenvolvimento tecnológico; 
  e) o referencial desenvolvido pelo Grupo de Trabalho Produção Técnica da CAPES, criado em 2018, cuja finalidade foi propor metodologias para avaliação de produções técnicas e tecnológicas.
  <br /><br />
  A produção acadêmica considerada nesta análise corresponde ao período quadrienal mais recente da CAPES, abrangendo os últimos quatro anos. Nessa etapa, são avaliadas tanto a quantidade de artigos publicados quanto sua qualificação no sistema Qualis. A metodologia utilizada está alinhada à ficha de avaliação da área interdisciplinar, a qual inclui o cálculo do Indicador de Produção Intelectual em Periódicos (IndProdArt).
</p>


<Alert>
<p className=" text-justify">
       O tempo de doutorado, análise do estrato Qualis e experiência na pós-graduação
Stricto Sensu seguem o Edital CNPq Nº 04/2021, que exige 3 anos (Pesquisador 2), 8
anos (Pesquisador 1D) e 10 anos (Pesquisador 1C e 1B), com uma faixa intermediária
de 3 a 6 anos. O edital também valoriza artigos bem avaliados no Qualis-Capes e exige
pelo menos duas orientações concluídas para níveis mais elevados de bolsas.
Além desses critérios, há uma regra que permite substituir a produção acadêmica
por produção técnica, como patentes e softwares. Se o pesquisador não atingir a
produção acadêmica necessária, pode usar essa substituição. Nos níveis A+ e A, um
artigo A1 pode ser trocado por uma patente; nos níveis B+, B, C+, C e D+, qualquer
artigo pode ser substituído por uma patente ou três softwares.
       </p>
</Alert>


 
</Alert>


<Alert className="space-y-4 p-8">
<h2 className="text-2xl font-semibold">2. Tabela de índice do pesquisador</h2>
<Table className="rounded-md">
  
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Nível</TableHead>
      <TableHead>Tempo de Doutorado (anos)</TableHead>
      <TableHead>Produção Acadêmica*</TableHead>
      <TableHead>Experiência PG (Orientação)</TableHead>
      <TableHead>Regra Combinada</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {researchers.map((researcher, index) => (
      <TableRow key={index}>
        <TableCell className="font-medium flex gap-2 items-center"><div
className={`rounded-md h-4 w-4 ${
classificationColors[researcher.level] || "bg-neutral-200"
}`}
>
</div>{researcher.level}</TableCell>
        <TableCell>{researcher.phdYears}</TableCell>
        <TableCell>{researcher.academicProduction}</TableCell>
        <TableCell>{researcher.pgExperience}</TableCell>
        <TableCell>{researcher.combinedRule}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={5} className="text-center">
      (A - Artigo)
(AB – Qualquer artigo qualis B)
(AA – Qualquer artigo qualis A )
(A1 – Artigo qualis A1)
(L – Livro )
(CL – Capítulo Livro)

      </TableCell>
    </TableRow>
  </TableFooter>
</Table>
</Alert>

        </div>

        </main>
    )
}