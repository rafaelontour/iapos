import { useContext } from "react";
import { UserContext } from "../../../context/context";
import { Blocks, Building2, Check, ChevronLeft, ClipboardEdit, FlaskConical, GraduationCap, Home, Mail, Minus, PieChart, SlidersHorizontal, Users, Weight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../../ui/alert";

export function VisaoGeralHomeDashboard() {
      const { role, permission, urlGeral, urlGeralAdm, user, version } = useContext(UserContext);

    const permissions = {
        hasBaremaAvaliacao: permission.some(perm => perm.permission === 'criar_barema_avaliacao'),
        hasNotificacoes: permission.some(perm => perm.permission === 'enviar_notificacoes'),
        hasVisualizarPesquisadores: permission.some(perm => perm.permission === 'visualizar_pesquisadores'),
        hasVisualizarTodosDepartamentos: permission.some(perm => perm.permission === 'visualizar_todos_departamentos'),
        hasVisualizarTodosProgramas: permission.some(perm => perm.permission === 'visualizar_todos_programas'),
        hasVisualizarGruposPesquisa: permission.some(perm => perm.permission === 'visualizar_grupos_pesquisa'),
        hasVisualizarInct: permission.some(perm => perm.permission === 'visualizar_inct'),
        hasEditarPesosAvaliacao: permission.some(perm => perm.permission === 'editar_pesos_avaliacao'),
        hasVisualizarIndicadoresInstituicao: permission.some(perm => perm.permission === 'visualizar_indicadores_instituicao'),
        hasVisualizarGerenciaModuloAdministrativo: permission.some(perm => perm.permission === 'visualizar_gerencia_modulo_administrativo')
      };

        const accessLinks = [
          { permission: 'hasVisualizarGerenciaModuloAdministrativo', to: '/dashboard/administrativo', icon: <SlidersHorizontal size={16} />, label: 'Administrativo' },
          { permission: 'hasVisualizarTodosDepartamentos', to: '/dashboard/departamentos', icon: <Building2 size={16} />, label: 'Departamentos' },
          { permission: 'hasVisualizarPesquisadores', to: '/dashboard/pesquisadores', icon: <Users size={16} />, label: 'Pesquisadores' },
          { permission: 'hasVisualizarTodosProgramas', to: '/dashboard/programas', icon: <GraduationCap size={16} />, label: 'Programas' },
          { permission: 'hasVisualizarGruposPesquisa', to: '/dashboard/grupos-pesquisa', icon: <Blocks size={16} />, label: 'Grupos de pesquisa' },
          { permission: 'hasVisualizarInct', to: '/dashboard/inct', icon: <FlaskConical size={16} />, label: 'INCT\'s' },
          { permission: 'hasEditarPesosAvaliacao', to: '/dashboard/pesos-avaliacao', icon: <Weight size={16} />, label: 'Pesos de avaliação' },
          { permission: 'hasVisualizarIndicadoresInstituicao', to: '/dashboard/indicadores', icon: <PieChart size={16} />, label: 'Indicadores' },
          { permission: 'hasBaremaAvaliacao', to: '/dashboard/baremas', icon: <ClipboardEdit size={16} />, label: 'Baremas' },
          { permission: 'hasNotificacoes', to: '/dashboard/enviar-notificacoes', icon: <Mail size={16} />, label: 'Enviar notificações' }
        ];
    
    return(
        <main className="px-4 md:px-8 grid grid-cols-1 gap-8 pb-4 md:pb-8">

<div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 xl:grid-cols-4">
        {accessLinks.map(({ permission, to, icon, label }) => 
          permissions[permission] && (
            <Link to={to} key={to} >
              <Alert className="h-[80px] bg-blue-100 border-0 hover:bg-blue-200 text-sm dark:bg-blue-100/50 dark:hover:bg-blue-200/50 transition-all cursor-pointer flex items-center lg:p-8">
                <div className="flex w-full justify-between items-center gap-3  cursor-pointer">
                  <div>
                  {label}
                  </div>

                  <div className="h-10 w-10 rounded-md bg-black/10 flex items-center justify-center">
                  {icon}
                  </div>
                </div>
              </Alert>
            </Link>
          )
        )}
      </div>
        </main>
    )
}