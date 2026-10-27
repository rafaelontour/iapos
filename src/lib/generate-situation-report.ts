// @ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

export interface SituationReportParams {
  researcherId?: string;
  name?: string;
  lattesId?: string;
  urlGeral: string;
  fallbackArea?: string;
  fallbackLattesUpdate?: string;
  graduateProgramId?: string;
}

export async function downloadSituationReport({
  researcherId,
  name,
  lattesId,
  urlGeral,
  fallbackArea,
  fallbackLattesUpdate,
  graduateProgramId,
}: SituationReportParams): Promise<void> {
  const toastId = toast.loading("Gerando relatório de situação...");

  try {
    let resolvedId = researcherId;

    // Se não tiver ID direto ou se for apenas o lattes_id sem o ID do banco (UUID)
    if (!resolvedId && name) {
      try {
        const respName = await fetch(`${urlGeral}researcherName?name=${encodeURIComponent(name.split(' ').join(';'))}`);
        if (respName.ok) {
          const list = await respName.json();
          if (Array.isArray(list) && list.length > 0) {
            resolvedId = list[0].id;
          }
        }
      } catch (e) {
        console.error("Erro ao resolver ID por nome:", e);
      }
    }

    if (!resolvedId) {
      toast.dismiss(toastId);
      toast.error("Não foi possível identificar o pesquisador no sistema.");
      return;
    }

    let url = `${urlGeral}researcher/situation-report?researcher_id=${resolvedId}`;
    if (graduateProgramId) {
      url += `&graduate_program_id=${encodeURIComponent(graduateProgramId)}`;
    }
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error("Erro ao buscar dados do relatório");
    }
    const data = await resp.json();

    if (!data || !data.researcher) {
      toast.dismiss(toastId);
      toast.error("Dados de situação não encontrados para este pesquisador.");
      return;
    }

    const quadrienal: string = data.quadrienal ?? '';
    const resData = {
      ...(data.researcher ?? {}),
      area: data.researcher?.area || fallbackArea || '—',
    };

    const formatLattesDate = (val: any): string => {
      if (!val) return '—';
      const str = String(val).trim();
      if (!str || str === 'undefined' || str === 'null') return '—';
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        const [year, month, day] = str.slice(0, 10).split('-');
        return `${day}/${month}/${year}`;
      }
      try {
        const d = new Date(str);
        if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
      } catch {}
      return str;
    };

    const lattesUpdateFormatted = formatLattesDate(
      resData.lattes_update || fallbackLattesUpdate
    );

    const guidances: any[] = data.active_guidances ?? [];

    // Período Atual (2025-2028) — em andamento
    const currentPeriod = data.current_period ?? {};
    const currentArticles: any[] = currentPeriod.articles ?? [];
    const currentSummaryRaw: any[] = currentPeriod.summary ?? [];
    const currentExtraProds: Record<string, any[]> = currentPeriod.productions ?? {};
    const currentIndProd: number = currentPeriod.ind_prod ?? data.ind_prod_current ?? 0;
    const currentYearsAvailable: number = currentPeriod.years_available ?? data.ind_prod_current_years ?? 0;

    // Período Anterior (2021-2024) — referência CAPES
    const previousPeriod = data.previous_period ?? {};
    const prevArticles: any[] = previousPeriod.articles ?? data.quadrienal_articles ?? [];
    const prevSummaryRaw: any[] = previousPeriod.summary ?? data.quadrienal_summary ?? [];
    const prevExtraProds: Record<string, any[]> = previousPeriod.productions ?? data.quadrienal_productions ?? {};
    const prevIndProd: number = previousPeriod.ind_prod ?? data.ind_prod ?? 0;

    // Busca foto do pesquisador em Base64 para embutir no PDF (evita bloqueio CORS no html2canvas)
    let photoBase64 = '';
    try {
      const photoCandidates = [
        resolvedId ? `${urlGeral}ResearcherData/Image?researcher_id=${resolvedId}` : '',
        lattesId ? `${urlGeral}ResearcherData/Image?lattes_id=${lattesId}` : '',
        name ? `${urlGeral}ResearcherData/Image?name=${encodeURIComponent(name)}` : '',
      ].filter(Boolean);

      for (const photoUrl of photoCandidates) {
        try {
          const imgResp = await fetch(photoUrl);
          if (imgResp.ok) {
            const blob = await imgResp.blob();
            if (blob && blob.size > 200 && blob.type.startsWith('image/')) {
              photoBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string) || '');
                reader.onerror = () => resolve('');
                reader.readAsDataURL(blob);
              });
              if (photoBase64) break;
            }
          }
        } catch {
          // tenta o próximo candidato
        }
      }
    } catch (err) {
      console.log("Foto do pesquisador indisponível:", err);
    }

    const LABEL_TIPOS: Record<string, string> = {
      ARTICLE: "Artigos",
      BOOK: "Livros",
      BOOK_CHAPTER: "Capítulos",
      WORK_IN_EVENT: "Trabalhos em Eventos",
      TEXT_IN_NEWSPAPER_MAGAZINE: "Textos em Revista",
      SOFTWARE: "Softwares",
      PATENT: "Patentes",
      BRAND: "Marcas",
    };

    const buildSummaryCards = (summaryRaw: any[], articles: any[], extraProds: Record<string, any[]>) => {
      const summaryByType: Record<string, number> = {};
      if (summaryRaw && summaryRaw.length > 0) {
        summaryRaw.forEach((s: any) => {
          if (s.type && s.total) {
            summaryByType[s.type] = (summaryByType[s.type] || 0) + Number(s.total);
          }
        });
      }
      if (articles.length > 0 && !summaryByType['ARTICLE']) {
        summaryByType['ARTICLE'] = articles.length;
      }
      Object.entries(extraProds).forEach(([tipo, itens]) => {
        if (!summaryByType[tipo]) {
          summaryByType[tipo] = (itens as any[]).length;
        }
      });

      const entries = Object.entries(summaryByType);
      if (entries.length === 0) return '';
      return `
        <table style="border-collapse: separate; border-spacing: 8px 0; margin: 4px 0 10px -8px;">
          <tr>
            ${entries.map(([tipo, total]) => `
            <td style="background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: 6px; padding: 8px 16px; text-align: center; vertical-align: middle;">
              <div style="font-size: 20px; font-weight: 800; color: #1e3a8a; line-height: 1;">${total}</div>
              <div style="font-size: 10.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; line-height: 1.2; white-space: nowrap;">${LABEL_TIPOS[tipo] || tipo}</div>
            </td>`).join('')}
          </tr>
        </table>`;
    };

    const renderArticleTable = (articlesList: any[], maxRows = 25) => {
      if (!articlesList || articlesList.length === 0) return '';
      const rows = articlesList.slice(0, maxRows).map(a => `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:6px 12px;font-size:12px;">${a.title ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;color:#6b7280;white-space:nowrap;">${a.journal ?? '—'}</td>
          <td style="padding:6px 12px;font-size:12px;text-align:center;font-weight:700;color:#1e3a8a;">${a.qualis ?? 'SQ'}</td>
          <td style="padding:6px 12px;font-size:12px;text-align:center;">${a.year ?? '—'}</td>
        </tr>`).join('');
      return `
        <div style="margin-top: 14px;">
          <div style="font-size: 12.5px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">Artigos em Periódicos (${articlesList.length})</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 7px 10px; text-align: left; color: #475569; font-weight: 700;">Título</th>
                <th style="padding: 7px 10px; text-align: left; color: #475569; font-weight: 700; width: 32%;">Periódico</th>
                <th style="padding: 7px 10px; text-align: center; color: #475569; font-weight: 700; width: 10%;">Qualis</th>
                <th style="padding: 7px 10px; text-align: center; color: #475569; font-weight: 700; width: 8%;">Ano</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          ${articlesList.length > maxRows ? `<div style="font-size: 10.5px; color: #94a3b8; margin-top: 6px;">* Exibindo os ${maxRows} artigos mais recentes de ${articlesList.length} registrados.</div>` : ''}
        </div>`;
    };

    const renderExtraProductions = (extraProds: Record<string, any[]>) => {
      return Object.entries(extraProds).map(([tipo, itens]) => {
        const labelTipo = LABEL_TIPOS[tipo] || tipo;
        const rows = (itens as any[]).map(p => `
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:6px 12px;font-size:12px;">${p.title ?? '—'}</td>
            <td style="padding:6px 12px;font-size:12px;text-align:center;width:8%;">${p.year ?? '—'}</td>
          </tr>`).join('');
        return `
        <div style="margin-top: 14px;">
          <div style="font-size: 12.5px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">${labelTipo} (${(itens as any[]).length})</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 7px 10px; text-align: left; color: #475569; font-weight: 700;">Título</th>
                <th style="padding: 7px 10px; text-align: center; color: #475569; font-weight: 700; width: 8%;">Ano</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
      }).join('');
    };

    const currentCardsHtml = buildSummaryCards(currentSummaryRaw, currentArticles, currentExtraProds);
    const prevCardsHtml = buildSummaryCards(prevSummaryRaw, prevArticles, prevExtraProds);

    const guidancesByType: Record<string, any[]> = {};
    guidances.forEach((g: any) => {
      const key = g.type || 'OUTROS';
      if (!guidancesByType[key]) guidancesByType[key] = [];
      guidancesByType[key].push(g);
    });

    const gps: any[] = resData.graduate_programs ?? [];
    const gpList = gps.map((g: any) => {
      const progTipo = g.program_type || g.type_program || '';
      const mod = g.modality || '';
      const nivel = [progTipo, mod].filter(Boolean).join(' ');
      const vinculo = g.type ? ` (${g.type})` : '';
      const detalhe = nivel ? ` — ${nivel}` : '';
      return `${g.acronym ?? g.name}${detalhe}${vinculo}`;
    }).join('<br>');

    const renderComparisonBarSvg = (
      minVal: number,
      maxVal: number,
      currentVal: number,
      programLabel: string
    ) => {
      if (maxVal <= 0 && currentVal <= 0) return '';

      const effectiveMin = Math.min(minVal, currentVal);
      const effectiveMax = Math.max(maxVal, currentVal);
      const range = effectiveMax - effectiveMin;
      const pct = range > 0 ? (currentVal - effectiveMin) / range : 0.5;
      const clampedPct = Math.max(0, Math.min(1, pct));

      const svgWidth = 460;
      const svgHeight = 74;
      const xStart = 50;
      const xEnd = svgWidth - 50;
      const usableWidth = xEnd - xStart;
      const xCur = xStart + clampedPct * usableWidth;

      const txtMin = effectiveMin.toFixed(2);
      const txtMax = effectiveMax.toFixed(2);
      const txtCur = currentVal.toFixed(2);

      const balloonWidth = 54;
      const balloonHeight = 20;
      const balloonX = Math.max(6, Math.min(xCur - balloonWidth / 2, svgWidth - balloonWidth - 6));

      return `
        <div class="page-break-avoid" style="margin-top: 14px; padding: 12px 16px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <div style="font-size: 11px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">
              Comparativo de Alcance do IndProd no Programa${programLabel ? ` (${programLabel})` : ''}
            </div>
            <div style="font-size: 10.5px; color: #64748b; font-style: italic;">
              Quadriênio 2025–2028
            </div>
          </div>
          <div style="display: flex; justify-content: center; padding-top: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="${svgHeight}px" style="max-width: 500px; display: block;">
              <!-- Linha de Fundo Cinza -->
              <line x1="${xStart}" y1="42" x2="${xEnd}" y2="42" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
              
              <!-- Linha Ativa até o Pesquisador -->
              <line x1="${xStart}" y1="42" x2="${xCur}" y2="42" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/>
              
              <!-- Ponto Menor -->
              <circle cx="${xStart}" cy="42" r="6" fill="#64748b" />
              <text x="${xStart}" y="59" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" fill="#64748b" font-weight="600">Menor</text>
              <text x="${xStart}" y="71" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#334155" font-weight="700">${txtMin}</text>

              <!-- Ponto Maior -->
              <circle cx="${xEnd}" cy="42" r="6" fill="#64748b" />
              <text x="${xEnd}" y="59" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" fill="#64748b" font-weight="600">Maior</text>
              <text x="${xEnd}" y="71" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#334155" font-weight="700">${txtMax}</text>

              <!-- Marcador Vertical do Pesquisador -->
              <line x1="${xCur}" y1="30" x2="${xCur}" y2="54" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round"/>
              <circle cx="${xCur}" cy="42" r="5" fill="#1e3a8a"/>
              
              <!-- Balão com a pontuação do Pesquisador -->
              <rect x="${balloonX}" y="8" width="${balloonWidth}" height="${balloonHeight}" rx="4" fill="#1e3a8a"/>
              <text x="${balloonX + balloonWidth / 2}" y="22" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" fill="#ffffff" font-weight="800">${txtCur}</text>
            </svg>
          </div>
        </div>
      `;
    };

    // Suporta lista de programas (program_comparisons) ou objeto único legado (program_comparison)
    const progCompList: any[] = data.program_comparisons?.length
      ? data.program_comparisons
      : data.program_comparison
        ? [data.program_comparison]
        : [];

    // Deduplica por sigla do programa para não duplicar Mestrado e Doutorado (ex: GETEC e MCTI)
    const seenProgLabels = new Set<string>();
    let comparisonBarHtml = '';
    for (const progComp of progCompList) {
      if (progComp && progComp.current && (progComp.current.max_ind_prod > 0 || currentIndProd > 0)) {
        const compCurr = progComp.current;
        const progLabel = (progComp.acronym || progComp.program_name || '').trim();
        if (progLabel && seenProgLabels.has(progLabel)) continue;
        if (progLabel) seenProgLabels.add(progLabel);

        comparisonBarHtml += renderComparisonBarSvg(
          Number(compCurr.min_ind_prod) || 0,
          Number(compCurr.max_ind_prod) || 0,
          Number(currentIndProd) || 0,
          progLabel
        );
      }
    }

    const guidanceRows = Object.entries(guidancesByType).map(([tipo, items]) => `
      <tr style="background:#f0f4ff;">
        <td colspan="4" style="padding:8px 12px;font-weight:700;font-size:13px;color:#1e3a8a;">
          ${tipo} (${items.length} orientação${items.length !== 1 ? 'ões' : ''})
        </td>
      </tr>
      ${items.map(g => `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:6px 12px;font-size:12px;">${g.student_name ?? '—'}</td>
        <td style="padding:6px 12px;font-size:12px;color:#6b7280;">${g.title ?? '—'}</td>
        <td style="padding:6px 12px;font-size:12px;text-align:center;">${g.year ?? '—'}</td>
        <td style="padding:6px 12px;font-size:12px;text-align:center;color:#16a34a;font-style:italic;">Em Andamento</td>
      </tr>`).join('')}`
    ).join('');

    const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    const html = `
    <style>
      .page-break-avoid { page-break-inside: avoid !important; }
      .page-break-after-avoid { page-break-after: avoid !important; }
      tr { page-break-inside: avoid !important; }
    </style>
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; color: #111827; line-height: 1.4;">
      <!-- Header Principal -->
      <div class="page-break-avoid" style="background: #1e3a8a; color: #ffffff; padding: 22px 32px; border-radius: 6px 6px 0 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 11px; letter-spacing: 1.5px; color: #93c5fd; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">iaPós · SENAI CIMATEC</div>
            <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">Relatório de Situação do Pesquisador</h1>
            <div style="font-size: 12.5px; color: #bfdbfe;">
              Quadriênio Atual: <strong>2025–2028 (Em Andamento)</strong> &nbsp;·&nbsp; Referência Histórica: <strong>2021–2024</strong>
            </div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #bfdbfe; line-height: 1.5;">
            <div>Emissão: ${now}</div>
            ${lattesUpdateFormatted && lattesUpdateFormatted !== '—' ? `
            <div style="margin-top: 4px; color: #ffffff; font-weight: 600;">
              Atualização Lattes: <strong>${lattesUpdateFormatted}</strong>
            </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Dados do pesquisador -->
      <div class="page-break-avoid" style="border: 1px solid #e5e7eb; border-top: none; padding: 20px 32px; background: #f8fafc;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            ${photoBase64 ? `
            <td style="width: 90px; vertical-align: top; padding-right: 20px;">
              <div style="width: 82px; height: 102px; border-radius: 6px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); background-image: url('${photoBase64}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
            </td>` : ''}
            <td style="vertical-align: top;">
              <h2 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800; color: #1e3a8a;">${resData.name ?? '—'}</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #334155;">
                <tbody>
                  <tr>
                    <td style="padding: 4px 0; width: 50%;"><strong>Formação:</strong> ${resData.graduation ?? '—'}</td>
                    <td style="padding: 4px 0; width: 50%;"><strong>Instituição:</strong> ${resData.institution ?? '—'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;"><strong>Área:</strong> ${resData.area ?? '—'}</td>
                    <td style="padding: 4px 0;">
                      <strong>Lattes ID:</strong> ${resData.lattes_id ?? '—'}
                      ${lattesUpdateFormatted && lattesUpdateFormatted !== '—' ? ` &nbsp;·&nbsp; <strong>Atualização do Lattes:</strong> ${lattesUpdateFormatted}` : ''}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;">
                      ${resData.h_index ? `<strong>H-Index (OpenAlex):</strong> ${resData.h_index}` : ''}
                      ${resData.i10_index ? ` &nbsp;·&nbsp; <strong>i10:</strong> ${resData.i10_index}` : ''}
                      ${resData.cited_by_count ? ` &nbsp;·&nbsp; <strong>Citações:</strong> ${resData.cited_by_count}` : ''}
                    </td>
                    <td style="padding: 4px 0;">${resData.orcid ? `<strong>ORCID:</strong> ${resData.orcid}` : ''}</td>
                  </tr>
                  ${(currentIndProd > 0 || prevIndProd > 0) ? `
                  <tr>
                    <td style="padding: 6px 0 0 0;" ${currentIndProd > 0 && prevIndProd > 0 ? 'colspan="2"' : 'colspan="2"'}>
                      ${currentIndProd > 0 ? `<strong>IndProd Médio 2025-2028:</strong> ${(Number(currentIndProd) || 0).toFixed(2)}${currentYearsAvailable > 0 ? ` <span style="color:#6b7280;font-size:11px;">(${currentYearsAvailable} ano${currentYearsAvailable > 1 ? 's' : ''} disponíveis)</span>` : ''}` : ''}
                      ${currentIndProd > 0 && prevIndProd > 0 ? '&nbsp;&nbsp;·&nbsp;&nbsp;' : ''}
                      ${prevIndProd > 0 ? `<strong>IndProd Médio 2021-2024:</strong> ${(Number(prevIndProd) || 0).toFixed(2)}` : ''}
                    </td>
                  </tr>` : ''}
                </tbody>
              </table>
            </td>
          </tr>
        </table>
        ${gpList ? `<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #475569;"><strong>Programas de Pós-Graduação:</strong><div style="margin-top: 4px;">${gpList}</div></div>` : ''}
        ${comparisonBarHtml}
      </div>

      <!-- SEÇÃO 1: Produção no Quadriênio Atual (2025-2028) -->
      <div style="padding: 22px 32px; border: 1px solid #e5e7eb; border-top: none; background: #ffffff;">
        <div class="page-break-avoid page-break-after-avoid" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 6px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">
            Produção no Quadriênio Atual (2025–2028)
          </h3>
          <span style="font-size: 11px; color: #6b7280; font-style: italic; white-space: nowrap;">
            Em Andamento${currentYearsAvailable > 0 ? ` (${currentYearsAvailable} ano${currentYearsAvailable > 1 ? 's' : ''})` : ''}
          </span>
        </div>

        <div class="page-break-avoid" style="margin-bottom: 14px;">
          ${currentCardsHtml || '<div style="color: #6b7280; font-size: 12px; padding: 6px 0;">Nenhuma produção bibliográfica registrada até o momento no Lattes para o quadriênio 2025–2028.</div>'}
        </div>

        ${renderArticleTable(currentArticles, 20)}
        ${renderExtraProductions(currentExtraProds)}
      </div>

      <!-- SEÇÃO 2: Orientações Ativas -->
      <div style="padding: 22px 32px; border: 1px solid #e5e7eb; border-top: none; background: #ffffff;">
        <div class="page-break-avoid page-break-after-avoid" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 6px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">
            Orientações Ativas (Itens em Andamento)
          </h3>
          <span style="font-size: 11px; color: #6b7280; font-style: italic; white-space: nowrap;">
            ${guidances.length} ativa${guidances.length !== 1 ? 's' : ''}
          </span>
        </div>

        ${guidances.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
              <th style="padding: 7px 10px; text-align: left; color: #475569; font-weight: 700; width: 30%;">Orientando</th>
              <th style="padding: 7px 10px; text-align: left; color: #475569; font-weight: 700;">Título</th>
              <th style="padding: 7px 10px; text-align: center; color: #475569; font-weight: 700; width: 10%;">Ano Início</th>
              <th style="padding: 7px 10px; text-align: center; color: #475569; font-weight: 700; width: 14%;">Status</th>
            </tr>
          </thead>
          <tbody>${guidanceRows}</tbody>
        </table>` : `
        <div style="color: #6b7280; font-size: 12px; padding: 6px 0;">Nenhuma orientação com status ativo/em andamento no momento.</div>`}
      </div>

      <!-- SEÇÃO 3: Histórico Consolidado — Quadriênio Anterior (2021-2024) -->
      <div style="padding: 22px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px; background: #ffffff;">
        <div class="page-break-avoid page-break-after-avoid" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 6px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">
            Histórico Consolidado — Quadriênio 2021–2024
          </h3>
          <span style="font-size: 11px; color: #6b7280; font-style: italic; white-space: nowrap;">
            Referência CAPES
          </span>
        </div>

        <div class="page-break-avoid" style="margin-bottom: 14px;">
          ${prevCardsHtml || '<div style="color: #6b7280; font-size: 12px; padding: 6px 0;">Nenhuma produção registrada para o quadriênio 2021-2024.</div>'}
        </div>

        ${renderArticleTable(prevArticles, 30)}
        ${renderExtraProductions(prevExtraProds)}
      </div>

      <!-- Rodapé -->
      <div class="page-break-avoid" style="margin-top: 14px; font-size: 10.5px; color: #94a3b8; text-align: center; padding-bottom: 10px;">
        Documento gerado eletronicamente pela plataforma analítica iaPós · SENAI CIMATEC · ${now}
      </div>
    </div>`;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    await html2pdf().set({
      margin: [6, 8, 6, 8],
      filename: `Relatorio_Situacao_${resData.name?.replace(/\s+/g, '_') ?? 'pesquisador'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }).from(container).save();

    document.body.removeChild(container);
    toast.dismiss(toastId);
    toast.success("Relatório gerado com sucesso!");
  } catch (err) {
    console.error(err);
    toast.dismiss(toastId);
    toast.error("Erro ao gerar relatório de situação");
  }
}
