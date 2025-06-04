import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../../context/context";
import { Button } from "../../ui/button";
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "../../ui/alert";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { toast } from "sonner";
import { Envelope, Spinner } from "phosphor-react";
import { renderToStaticMarkup } from "react-dom/server";

// Interfaces para as produções que vamos buscar
interface Producao {
  id: string;
  title: string;
  authors: string;
  year: number;
  doi?: string;
  journal?: string;
  type: "article" | "book" | "book_chapter" | "patent" | "software";
  // Campos extras para visual do card
  qualis?: string;
  Qualis?: string;
  qualis_capes?: string;
  jcr?: string;
  jcr_link?: string;
  jif?: string;
  magazine?: string;
  name_periodical?: string;
  periodical?: string;
  revista?: string;
  journal_name?: string;
}

interface NewsletterProps {
  title: string;
  producoes: Producao[];
  platformName: string;
  logoUrl?: string;
}

// Componente que gera o HTML do email da newsletter
const qualisColor = (qualis) => {
  if (!qualis) return '#bbb';
  const q = qualis.toUpperCase();
  if (q === 'A1') return '#006837';
  if (q === 'A2') return '#8FC53E';
  if (q === 'A3') return '#ACC483';
  if (q === 'A4') return '#BDC4B1';
  if (q === 'B1') return '#F15A24';
  if (q === 'B2') return '#F5831F';
  if (q === 'B3') return '#F4AD78';
  if (q === 'B4') return '#F4A992';
  if (q === 'B5') return '#F2D3BB';
  if (q === 'C') return '#EC1C22';
  if (q === 'SQ') return '#560B11'; // Special Qualis
  return '#560B11'; // Default color for unknown or 'None'
};

// Componente que renderiza o template do email
const NewsletterTemplate = ({ title, producoes, platformName }: NewsletterProps) => {
  const isConectee = import.meta.env.VITE_VERSION === 'true';
  const footerSignature = isConectee ? 'Conectee' : 'Simcc';
  const platformUrl = isConectee ? 'https://conectee.eng.ufmg.br' : 'https://simcc.uesc.br';
  const logoUrl = isConectee
    ? 'https://imgur.com/RADeuv1.png'
    : 'https://imgur.com/YWO7lyF.png';
  const rows: Producao[][] = [];
  for (let i = 0; i < 4; i += 2) {
    rows.push(producoes.slice(i, i + 2));
  }
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Lexend, Arial, Verdana, Tahoma, sans-serif', color: '#222', backgroundColor: '#559FB8', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 0, position: 'relative' }}>
      <tbody>
        {/* Header com logo e título menor */}
        <tr>
          <td colSpan={2} style={{ padding: 0, background: '#559FB8', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {/* Título menor*/}
                  <td style={{ paddingLeft: '32px', paddingTop: '120px', fontSize: '28px', color: '#fff', fontWeight: 600, fontFamily: 'Lexend, Arial, sans-serif', letterSpacing: '1px', lineHeight: 1.2, textAlign: 'left', minHeight: '90px' }}>
                    Newsletter semanal,<br />conheça as produções
                  </td>
                  {/* Logo*/}
                  <td style={{ textAlign: 'right', verticalAlign: 'top', paddingRight: '32px', paddingTop: '16px', minWidth: '120px' }}>
                    <img src={logoUrl} alt="Logo" style={{ maxHeight: '50px', width: 'auto', display: 'inline-block', verticalAlign: 'top' }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          {/* Barra colorida abaixo do header */}
          <td colSpan={2} style={{ background: '#559FB8', height: '48px' }}>
          </td>
        </tr>
        {/* Container para o conteúdo da newsletter */}
        <tr>
          <td colSpan={2} style={{ background: '#F7F8FA', borderLeft: '2px solid rgb(223, 223, 223)', borderRight: '2px solid rgb(223, 223, 223)', padding: 0 }}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ tableLayout: 'fixed', margin: '32px 0', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((prod, colIdx) => {
                      const qualis = prod.qualis || prod.Qualis || prod.qualis_capes;
                      const periodico = prod.journal || prod.magazine || prod.name_periodical || prod.periodical || prod.revista || prod.journal_name;
                      const jcr = prod.jcr || prod.jcr_link || prod.jif;
                      let cellPadding = '0 5px 24px 5px';
                      if (colIdx === 0) cellPadding = '0 10px 24px 10px';
                      if (colIdx === 1) cellPadding = '0 10px 24px 10px';
                      return (
                        <td key={colIdx} style={{ width: '50%', padding: cellPadding, verticalAlign: 'top' }}>
                          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <tbody>
                              <tr>
                                {/* Barra vertical colorida do Qualis */}
                                <td style={{ minWidth: '6px', background: qualisColor(qualis), borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', border: 'none', padding: 0, verticalAlign: 'top' }}>&nbsp;</td>
                                {/* Conteúdo do card */}
                                <td style={{ backgroundColor: '#fff', border: `1px solid #e5e5e5`, borderLeft: 'none', borderRadius: '10px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', width: '100%', minHeight: '120px', textAlign: 'left', padding: '16px 14px 12px 16px', boxSizing: 'border-box', marginBottom: '0', fontFamily: 'Lexend, Arial, sans-serif', verticalAlign: 'top' }}>
                                  {/* Cabeçalho: Periódico */}
                                  {periodico && (
                                    <div style={{ fontWeight: 700, color: '#101010', fontSize: '13px', marginBottom: '16px', fontFamily: 'Lexend, Arial, sans-serif', lineHeight: '1.2' }}>
                                      {periodico}
                                    </div>
                                  )}
                                  {/* Título da produção */}
                                  <div style={{ fontWeight: 400, color: '#101010', fontSize: '15px', marginBottom: '16px', lineHeight: '1.25', fontFamily: 'Lexend, Arial, sans-serif' }}>
                                    {prod.title}
                                  </div>
                                  {/* Linha Ano, Qualis, JCR */}
                                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#101010', whiteSpace: 'nowrap', marginBottom: 0, fontFamily: 'Lexend, Arial, sans-serif' }}>
                                    {/* Ano com ícone PNG */}
                                    <span style={{ display: 'flex', alignItems: 'center', minWidth: 48, flexWrap: 'wrap', marginRight: (qualis || jcr) ? 14 : 0 }}>
                                      <img src="https://i.imgur.com/MratU90.png" alt="Ano" style={{ width: 16, height: 16, marginRight: 4, verticalAlign: 'middle', display: 'inline-block' }} />
                                      <span style={{ fontWeight: 400, color: '#101010', fontFamily: 'Lexend, Arial, sans-serif' }}>{prod.year}</span>
                                    </span>
                                    {/* Qualis */}
                                    {qualis && (
                                      <span style={{ display: 'flex', alignItems: 'center', minWidth: 70, marginRight: jcr ? 14 : 0 }}>
                                        <span style={{
                                          width: 16,
                                          height: 16,
                                          borderRadius: 5,
                                          display: 'inline-block',
                                          background: qualisColor(qualis),
                                          marginRight: 4,
                                          border: '1px solid #e0e0e0',
                                          flexShrink: 0,
                                        }}></span>
                                        <span style={{ fontWeight: 400, color: '#101010', fontFamily: 'Lexend, Arial, sans-serif' }}>Qualis {qualis}</span>
                                      </span>
                                    )}
                                    {/* JCR com ícone PNG, só aparece se jcr existir */}
                                    {jcr && (
                                      <span style={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                                        <img src="https://i.imgur.com/fuWnmeI.png" alt="JCR" style={{ width: 16, height: 16, marginRight: 4, verticalAlign: 'middle', display: 'inline-block' }} />
                                        <span style={{ fontWeight: 400, color: '#101010', fontFamily: 'Lexend, Arial, sans-serif' }}>JCR {jcr}</span>
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      );
                    })}
                    {/* Preenche célula vazia se faltar */}
                    {row.length < 2 && <td style={{ width: '50%' }}></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
        {/* Rodapé com botão */}
        <tr>
          <td colSpan={2} style={{ background: '#559FB8', textAlign: 'center', padding: '18px 0 18px 0', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '0' }}>
                    <a href={platformUrl}
                      style={{
                        display: 'inline-block',
                        border: 'none',
                        padding: '14px 36px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        color: '#559FB8',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxShadow: '0 2px 6px rgba(23,78,166,0.08)',
                        transition: 'background 0.3s, filter 0.3s',
                        cursor: 'pointer',
                        marginBottom: '0px',
                        fontFamily: 'Lexend, Arial, sans-serif',
                      }}
                    >
                      Ver mais na plataforma
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {/* Rodapé informativo em fundo branco */}
        <tr>
          <td colSpan={2} style={{ textAlign: 'center', fontSize: '14px', color: '#222', padding: '10px 0 10px 0', fontFamily: 'Lexend, Arial, sans-serif', fontWeight: 500, letterSpacing: '0.01em', background: '#fff', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', marginTop: 0 }}>
            <span>Enviado por {footerSignature} • Não responda este e-mail</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

// Funções do componente principal NewsletterSender
export function NewsletterSender() {
  const { version, urlGeral } = useContext(UserContext);
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  // Email selection states
  const [allEmails, setAllEmails] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [manualEmail, setManualEmail] = useState("");
  const [emailList, setEmailList] = useState("");
  const [fetchingEmails, setFetchingEmails] = useState(false);
  const [emailFetchError, setEmailFetchError] = useState("");
  const [selectCount, setSelectCount] = useState("");
  const emailListRef = useRef<HTMLDivElement>(null);

  const platformName = version ? 'Conectee' : 'Simcc';
  
  // Buscar as produções recentes do endpoint outstanding_articles
  const fetchProducoes = async () => {
    setLoading(true);
    try {
      // Busca produções recentes do endpoint proxyado
      const response = await fetch("/api/outstanding_articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao buscar produções recentes");
      }
      const data = await response.json();
      // Mapeia para o formato esperado
      const producoesFormatadas = data.slice(0, 10).map((item: any) => ({
        id: item.id || item._id,
        title: item.title,
        authors: item.authors || item.author || item.researcher_name || (Array.isArray(item.name) ? item.name.join(", ") : item.name) || "Autores não informados",
        year: item.year,
        doi: item.doi,
        journal: item.journal_name,
        type: item.type || "article",
        qualis: item.qualis,
        Qualis: item.Qualis,
        qualis_capes: item.qualis_capes,
        jcr: item.jcr,
        jcr_link: item.jcr_link,
        jif: item.jif,
        magazine: item.magazine,
        name_periodical: item.name_periodical,
        periodical: item.periodical,
        revista: item.revista,
        journal_name: item.journal_name,
      }));
      console.log("Produções recentes retornadas:", producoesFormatadas);
      setProducoes(producoesFormatadas);
    } catch (error) {
      console.error("Erro ao buscar produções recentes:", error);
      toast.error("Erro ao buscar produções", {
        description: "Não foi possível carregar as produções recentes.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Busca produções ao montar o componente
  useEffect(() => {
    fetchProducoes();
  }, []);

  // Adiciona um estado para o HTML do preview
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    // Atualiza o preview HTML sempre que producoes, platformName ou selectedLogo mudarem
    const html = renderToStaticMarkup(
      <NewsletterTemplate
        title={"Produções Recentes da Semana"}
        producoes={producoes}
        platformName={platformName}
      />
    );
    setPreviewHtml(html);
  }, [producoes, platformName]);

  // Função para buscar emails do backend externo
  const fetchNewsletterEmails = async () => {
    setFetchingEmails(true);
    setEmailFetchError("");
    try {
      const res = await fetch("https://conectee.eng.ufmg.br/adm/newsletter");
      if (!res.ok) throw new Error("Erro ao buscar emails");
      const data = await res.json();
      // Filtra emails válidos e únicos
      const emails = data
        .map((item: any) => item.email?.trim())
        .filter((email: string) => email && email.includes("@"));
      setAllEmails(Array.from(new Set(emails)));
      setSelectedEmails([]);
    } catch (e) {
      setEmailFetchError("Erro ao buscar emails do servidor.");
    } finally {
      setFetchingEmails(false);
    }
  };

  // Busca emails ao montar
  useEffect(() => {
    fetchNewsletterEmails();
  }, []);

  // Seleção de todos
  const handleSelectAll = () => {
    setSelectedEmails(allEmails);
  };
  // Deselecionar todos
  const handleDeselectAll = () => {
    setSelectedEmails([]);
  };
  // Selecionar por quantidade
  const handleSelectCount = () => {
    const n = parseInt(selectCount);
    if (!isNaN(n) && n > 0) {
      setSelectedEmails(allEmails.slice(0, n));
    }
  };
  // Seleção individual
  const handleToggleEmail = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };
  // Adicionar email manual
  const handleAddManualEmail = () => {
    const email = manualEmail.trim();
    if (email && !selectedEmails.includes(email)) {
      setSelectedEmails((prev) => [...prev, email]);
      setManualEmail("");
    }
  };

  // Função para enviar a newsletter (usa selectedEmails + manual)
  const enviarNewsletter = async () => {
    const emailsToSend = [
      ...selectedEmails,
      ...emailList
        .split(/[,;\s]+/)
        .map((e) => e.trim())
        .filter((e) => e && !selectedEmails.includes(e)),
    ];
    if (emailsToSend.length === 0) {
      toast.error("Lista de emails vazia", {
        description: "Selecione ou digite pelo menos um email para enviar a newsletter."
      });
      return;
    }

    setSending(true);

    try {
      const htmlContent = renderToStaticMarkup(
        <NewsletterTemplate
          title={"Produções Recentes da Semana"}
          producoes={producoes}
          platformName={platformName}
        />
      );

      // Lista de emails (separados por vírgula, ponto-e-vírgula ou espaço)
      const emails = emailList
        .split(/[,;\s]+/)
        .map(email => email.trim())
        .filter(email => email);

      // Ajusta o assunto conforme logo
      const subjectPlatform = import.meta.env.VITE_VERSION === 'true' ? 'Conectee' : 'Simcc';

      // Enviar o email usando a API
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: emailsToSend,
          subject: `Newsletter de Produções Recentes - ${subjectPlatform}`,
          html: htmlContent,
          platform: version ? 'conectee' : 'simcc'
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar newsletter");
      }

      toast.success("Newsletter enviada com sucesso!", {
        description: `Newsletter enviada para ${emailsToSend.length} destinatário(s).`
      });

      // Limpar o campo de emails após envio bem-sucedido
      setEmailList("");
      
    } catch (error) {
      console.error("Erro ao enviar newsletter:", error);
      toast.error("Erro ao enviar newsletter", {
        description: "Não foi possível enviar a newsletter. Tente novamente mais tarde."
      });
    } finally {
      setSending(false);
    }
  };

  // Função para envio manual direto
  const enviarNewsletterManual = async () => {
    const email = manualEmail.trim();
    if (!email) return;
    setSending(true);
    try {
      const htmlContent = renderToStaticMarkup(
        <NewsletterTemplate
          title={"Produções Recentes da Semana"}
          producoes={producoes}
          platformName={platformName}
        />
      );
      const subjectPlatform = import.meta.env.VITE_VERSION === 'true' ? 'Conectee' : 'Simcc';
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: [email],
          subject: `Newsletter de Produções Recentes - ${subjectPlatform}`,
          html: htmlContent,
          platform: version ? 'conectee' : 'simcc'
        })
      });
      if (!response.ok) throw new Error("Falha ao enviar newsletter");
      toast.success("Newsletter enviada com sucesso!", {
        description: `Newsletter enviada para ${email}.`
      });
      setManualEmail("");
    } catch (error) {
      toast.error("Erro ao enviar newsletter", {
        description: "Não foi possível enviar a newsletter. Tente novamente mais tarde."
      });
    } finally {
      setSending(false);
    }
  };

  // Renderização do componente
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Enviar Newsletter de Produções
          </CardTitle>
          <CardDescription>
            Selecione a logo e envie uma newsletter para os emails desejados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Destinatários - lista e envio manual */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Destinatários</h3>
            <div className="flex items-center gap-2 mb-2">
              <Button size="sm" onClick={fetchNewsletterEmails} disabled={fetchingEmails}>
                Atualizar lista de emails
              </Button>
              <span className="text-xs text-muted-foreground">
                {fetchingEmails ? "Carregando..." :
                  emailFetchError ? emailFetchError :
                  `${allEmails.length} emails encontrados, ${selectedEmails.length} selecionados`}
              </span>
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #e5e5e5', borderRadius: '6px', background: '#fafbfc', padding: '8px' }}>
              {allEmails.slice(0, 200).map((email, idx) => (
                <div key={email} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email)}
                    onChange={() => handleToggleEmail(email)}
                    id={`email-${idx}`}
                  />
                  <label htmlFor={`email-${idx}`} style={{ marginLeft: '8px', fontSize: '13px' }}>{email}</label>
                </div>
              ))}
              {allEmails.length === 0 && !fetchingEmails && (
                <div className="text-xs text-muted-foreground">Nenhum email encontrado.</div>
              )}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={handleSelectAll} disabled={allEmails.length === 0}>Selecionar todos</Button>
              <Button size="sm" variant="outline" onClick={handleDeselectAll} disabled={selectedEmails.length === 0}>Limpar seleção</Button>
              <input
                type="number"
                min={1}
                max={allEmails.length}
                value={selectCount}
                onChange={e => setSelectCount(e.target.value)}
                placeholder="Qtd."
                style={{ width: '60px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '2px' }}
              />
              <Button size="sm" variant="outline" onClick={handleSelectCount} disabled={!selectCount || isNaN(Number(selectCount)) || Number(selectCount) < 1}>Selecionar qtd</Button>
            </div>
            {/* Campo de envio manual direto */}
            <div className="flex items-center gap-2 mt-4" style={{ borderTop: '1px solid #e5e5e5', paddingTop: '16px', marginTop: '8px' }}>
              <Input
                placeholder="Digite um email para envio rápido"
                value={manualEmail}
                onChange={e => setManualEmail(e.target.value)}
                style={{ maxWidth: '260px' }}
                onKeyDown={e => { if (e.key === 'Enter') enviarNewsletterManual(); }}
              />
              <Button size="sm" onClick={enviarNewsletterManual} disabled={!manualEmail.trim() || sending}>
                Enviar para este email
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Prévia do Conteúdo</h3>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner className="animate-spin w-8 h-8" />
              </div>
            ) : (
              <>
                <Alert>
                  <AlertTitle>Produções selecionadas ({producoes.length})</AlertTitle>
                  <AlertDescription className="text-sm">
                    Serão incluídas até 4 produções na newsletter.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {producoes.slice(0, 4).map((prod, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-sm mb-1 line-clamp-2">
                          {prod.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {prod.authors}
                        </p>
                        <p className="text-xs mt-1">
                          {prod.year}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={fetchProducoes} 
            disabled={loading || sending}
          >
            Atualizar produções
          </Button>
          
          <Button 
            onClick={enviarNewsletter} 
            disabled={loading || sending || producoes.length === 0}
            className="flex items-center gap-2"
          >
            {sending ? (
              <>
                <Spinner className="animate-spin w-4 h-4" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Envelope size={16} />
                <span>Enviar Newsletter</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Preview da Newsletter</h3>
        <div className="border-2 p-6 bg-white">
          {/* Renderiza o HTML do email exatamente como será enviado */}
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </div>
  );
}