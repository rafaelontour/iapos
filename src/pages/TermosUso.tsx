import { useTheme } from "next-themes";
import { LogoConectee } from "../components/svg/LogoConectee";
import { LogoConecteeWhite } from "../components/svg/LogoConecteeWhite";

import { useContext, useEffect } from "react";
import { UserContext } from "../context/context";

import { getVersion } from "../gerVersion";
import DocsLayout from "../layout/docs-layout";
import { DocsProvider } from "../components/provider/docs-provider";
import { useModalDocs } from "../components/hooks/use-modal-docs";
import { useLocation } from "react-router-dom";
import { el, es } from "date-fns/locale";

export function TermosUso() {
    const { theme } = useTheme();
    const { version, defaultLayout, navCollapsedSize, isCollapsed } = useContext(UserContext);
    const { onOpen } = useModalDocs()
    const location = useLocation();
    useEffect(() => {
        if (location.pathname == '/termos-uso') {
            onOpen('termos-uso')
        } else if (location.pathname == `/politica-privacidade`) {
            onOpen('politica-privacidade')
        } else if (location.pathname == `/api-docs`) {
            onOpen('api-docs')
        } else if (location.pathname == '/informacoes') {
            onOpen('informacoes')
        } else if (location.pathname == '/dicionario-cores') {
            onOpen('dicionario-cores')
        } else if (location.pathname == '/api-docs/producoes') {
            onOpen('producoes')
        } else if (location.pathname == '/api-docs/pesquisadores') {
            onOpen('pesquisadores')
        } else if (location.pathname == '/api-docs/bolsistas-cnpq') {
            onOpen('bolsistas-cnpq')
        } else if (location.pathname == '/api-docs/artigos-infos') {
            onOpen('artigos-infos')
        } else if (location.pathname == '/api-docs/capitulos-livros') {
            onOpen('capitulos-livros')
        } else if (location.pathname == '/api-docs/patentes') {
            onOpen('patentes')
        } else if (location.pathname == '/api-docs/softwares') {
            onOpen('softwares')
        } else if (location.pathname == '/api-docs/livros') {
            onOpen('livros')
        } else if (location.pathname == '/api-docs/relatorio-tecnico') {
            onOpen('relatorio-tecnico')
        } else if (location.pathname == '/api-docs/texto-revista') {
            onOpen('texto-revista')
        } else if (location.pathname == '/api-docs/trabalho-evento') {
            onOpen('trabalho-evento')
        } else if (location.pathname == '/api-docs/revistas') {
            onOpen('revistas')
        } else if (location.pathname == '/api-docs/projeto-pesquisa') {
            onOpen('projeto-pesquisa')
        } else if (location.pathname == '/api-docs/marca') {
            onOpen('marca')
        } else if (location.pathname == '/api-docs/orientacoes') {
            onOpen('orientacoes')
        } else if (location.pathname == '/api-docs/participacoes-eventos') {
            onOpen('participacoes-eventos')
        } else if(location.pathname == '/indice-pesquisador') {
            onOpen('indice-pesquisador')
        }  else if(location.pathname == '/modelos-documentos') {
            onOpen('modelos-documentos')
        } else if(location.pathname == '/videos') {
            onOpen('videos')
        }

    }, [location]);

    return (
        <DocsLayout
            defaultLayout={defaultLayout}
            defaultCollapsed={isCollapsed}
            navCollapsedSize={navCollapsedSize}
        >
            <DocsProvider />
        </DocsLayout>
    );
}
