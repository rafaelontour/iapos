import { create } from "zustand";
export type ModalType =
  | 'termos-uso'
  | 'politica-privacidade'
  | 'api-docs'
  | 'informacoes'
  | 'dicionario-cores'
  | 'producoes'
  | 'pesquisadores'
  | 'bolsistas-cnpq'
  | 'artigos-infos'
  | 'livros'
  | 'capitulos-livros'
  | 'patentes'
  | 'softwares'
  | 'relatorio-tecnico'
  | 'texto-revista'
  | 'trabalho-evento'
  | 'revistas'
  | 'projeto-pesquisa'
  | 'marca'
  | 'orientacoes'
  | 'participacoes-eventos'
  | 'indice-pesquisador'
  | 'modelos-documentos'
  | 'videos'


interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModalDocs = create<ModalStore>((set: any) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: any) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false })
}));