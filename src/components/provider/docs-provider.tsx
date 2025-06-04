"use client";

import { useEffect, useState } from "react";
import { ArticlesHome } from "../homepage/categorias/articles-home";
import { ResearchersHome } from "../homepage/categorias/researchers-home";

import { useModalResult } from "../hooks/use-modal-result";
import { PatentHome } from "../homepage/categorias/patent-home";
import { BookHome } from "../homepage/categorias/book-home";
import { SpeakerHome } from "../homepage/categorias/speaker-home";
import { InstitutionsHome } from "../homepage/categorias/institutions-home";
import { useModalDocs } from "../hooks/use-modal-docs";
import { TermosUso } from "../docs-api/termos-uso";
import { PoliticaPrivacidade } from "../docs-api/politica-privacidade";
import { ApiDocs } from "../docs-api/api-docs";
import { DicionarioCores } from "../docs-api/dicionario-cores";
import { Info } from "../info/info";
import { Producoes } from "../docs-api/api/producoes";
import { Pesquisadores } from "../docs-api/api/pesquisadores";
import { BolsistasCnpq } from "../docs-api/api/bolsistas-cnpq";
import { ArtigosInfos } from "../docs-api/api/artigos-infos";
import { Livros } from "../docs-api/api/livros";
import { CapitulosLivros } from "../docs-api/api/capitulos-livros";
import { PatentesInfos } from "../docs-api/api/patentes";
import { SoftwareInfos } from "../docs-api/api/softwares";
import { RelatorioTecnico } from "../docs-api/api/relatorio-tecnico";
import { TextoRevista } from "../docs-api/api/texto-revista";
import { TrabalhoEvento } from "../docs-api/api/trabalho-evento";
import { Revistas } from "../docs-api/api/revistas";
import { ProjetoPesquisa } from "../docs-api/api/projeto-pesquisa";
import { Marca } from "../docs-api/api/marca";
import { Orientacoes } from "../docs-api/api/orientacoes";
import { ParticipacoesEventos } from "../docs-api/api/participacoes-eventos";
import { IndicePesquisador } from "../indice-pesquisador/indice-pesquisador";
import { ModelosDocumentos } from "../docs-api/modelos-documentos";
import { Videos } from "../docs-api/videos";

const ModalContent = () => {
  const { type } = useModalDocs();

  switch (type) {
    case 'termos-uso':
      return <TermosUso />
    case 'politica-privacidade':
      return <PoliticaPrivacidade />
    case 'api-docs':
      return <ApiDocs />
    case 'dicionario-cores':
      return <DicionarioCores />
    case 'informacoes':
      return <Info />
    case 'producoes':
      return <Producoes />
    case 'pesquisadores':
      return <Pesquisadores />
    case 'bolsistas-cnpq':
      return <BolsistasCnpq />
    case 'artigos-infos':
      return <ArtigosInfos />
    case 'livros':
      return <Livros />
    case 'capitulos-livros':
      return <CapitulosLivros />
    case 'patentes':
      return <PatentesInfos />
    case 'softwares':
      return <SoftwareInfos />
    case 'relatorio-tecnico':
      return <RelatorioTecnico />
    case 'texto-revista':
      return <TextoRevista />
    case 'revistas':
      return <Revistas />
    case 'trabalho-evento':
      return <TrabalhoEvento />
    case 'projeto-pesquisa':
      return <ProjetoPesquisa />
    case 'marca':
      return <Marca />
    case 'orientacoes':
      return <Orientacoes />
    case 'participacoes-eventos':
      return <ParticipacoesEventos />
      case 'indice-pesquisador':
        return <IndicePesquisador/>
      case 'modelos-documentos':
        return <ModelosDocumentos/>
      case 'videos':
        return <Videos/>
  }

}
export const DocsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ModalContent />

}