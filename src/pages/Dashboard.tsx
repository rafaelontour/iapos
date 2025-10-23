
import { useContext, useEffect } from "react";
import { DashboardProvider } from "../components/provider/dashboard-provider";
import AdminLayout from "../layout/admin-layout";
import { useLocation } from "react-router-dom";
import { useModalDashboard } from "../components/hooks/use-modal-dashboard";
import { UserContext } from "../context/context";


export function Dashboard() {

    const { onOpen } = useModalDashboard();
    const { isCollapsed, navCollapsedSize, defaultLayout } = useContext(UserContext)

    const location = useLocation();

    useEffect(() => {
        if (location.pathname == '/dashboard') {
            onOpen('home-dashboard')
        } else if (location.pathname == '/config') {
            onOpen('master')
        } else if (location.pathname == '/dashboard/programas') {
            onOpen('graduate-program')
        } else if (location.pathname == '/dashboard/departamentos') {
            onOpen('departamentos')
        } else if (location.pathname == '/dashboard/departamento') {
            onOpen('departamento')
        } else if (location.pathname == '/dashboard/pesquisadores') {
            onOpen('researcher')
        } else if (location.pathname == '/dashboard/pesos-avaliacao') {
            onOpen('peso-producao')
        } else if (location.pathname == '/dashboard/grupos-pesquisa') {
            onOpen('grupo-pesquisa')
        } else if (location.pathname == '/dashboard/indicadores') {
            onOpen('indicadores')
        } else if (location.pathname == '/dashboard/baremas') {
            onOpen('baremas')
        } else if (location.pathname == '/dashboard/enviar-notificacoes') {
            onOpen('enviar-notificacoes')
        } else if (location.pathname == '/dashboard/informacoes') {
            onOpen('informacoes')
        } else if (location.pathname == '/dashboard/minha-area') {
            onOpen('minha-area')
        } else if (location.pathname == '/dashboard/administrativo') {
            onOpen('general')
        } else if (location.pathname == '/dashboard/minhas-producoes') {
            onOpen('minhas-producoes')
        } else if (location.pathname == '/dashboard/parametros-pesquisa') {
            onOpen('parametros-pesquisa')
        } else if (location.pathname == '/dashboard/secao-pessoal') {
            onOpen('sessao-pessoal')
        } else if (location.pathname == '/dashboard/construtor-pagina') {
            onOpen('construtor-pagina')
        } else if (location.pathname == '/dashboard/cargos-permissoes') {
            onOpen('cargos-permissoes')
        } else if (location.pathname == '/dashboard/instituicoes') {
            onOpen('instituicoes')
        } else if (location.pathname == '/dashboard/datas') {
            onOpen('datas')
        } else if (location.pathname == '/dashboard/programa') {
            onOpen('programa')
        } else if (location.pathname == '/dashboard/tags') {
            onOpen('tags')
        }
    }, [location]);

    return (
        <>
            <AdminLayout
                defaultLayout={defaultLayout}
                defaultCollapsed={isCollapsed}
                navCollapsedSize={navCollapsedSize}
            >
                <DashboardProvider />
            </AdminLayout>
        </>
    )
}