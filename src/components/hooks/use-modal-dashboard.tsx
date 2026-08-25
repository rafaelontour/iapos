
import { create } from "zustand";

export type ModalType = "general" | "researcher" | "dados-pos-graduacao" | "graduate-program" | "master" | 'departamento' | 'peso-producao' | 'grupo-pesquisa' | 'indicadores' | 'baremas' | 'enviar-notificacoes' | 'informacoes' | 'minha-area' | 'home-dashboard' | 'minhas-producoes' | 'parametros-pesquisa' | 'sessao-pessoal' | 'construtor-pagina' | 'cargos-permissoes' | 'instituicoes' | 'programa' | 'departamentos' | 'datas' | 'tags' | 'areas' | 'linhas-pesquisa'


interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModalDashboard = create<ModalStore>((set: any) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: any) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false })
}));