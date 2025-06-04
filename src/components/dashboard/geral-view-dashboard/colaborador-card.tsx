import { useEffect, useState } from "react";
 // ajuste conforme seu projeto

import { Alert } from "../../ui/alert";
import { getInstitutionImageName } from "../../homepage/categorias/institutions-home/institution-image-name";
import { Buildings, LinkSimple } from "phosphor-react";
import { Link } from "react-router-dom";
import { LinkedinIcon, Mail, Trash } from "lucide-react";
import { Button } from "../../ui/button";

interface ColaboradorProps {
  id: string;
  nome: string;
  instituicao: string;
  lattes: string;
  linkedin: string;
  email: string;
  imagem: string;
  criado_em: any; 

}

interface ColaboradorCardProps {
  colaborador: ColaboradorProps;
  deletable?: boolean;
  deleteColaborador?: (id: string, imagemUrl?: string) => Promise<void>;
}

export const ColaboradorCard = ({ colaborador, deleteColaborador, deletable }: ColaboradorCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteColaborador) {
      deleteColaborador(colaborador.id, colaborador.imagem);
    }
  };

  useEffect(() => {
    const fetchImage = async  () => {
      const url =  await getInstitutionImageName(colaborador.instituicao);
      setImageUrl(url);
    };
    fetchImage();
  }, [colaborador.instituicao]);

  return (
    <div className="flex group w-full">
    <div className="w-2 rounded-l-md border border-r-0 bg-eng-blue"></div>
     <Alert className=" rounded-l-none flex gap-3 p-8">
        <div className="flex flex-1 flex-col">
          <div className="">

            <div className="">
            <p className="text-lg font-medium">{colaborador.nome}</p>
            <div className="flex mb-8 text-gray-500 items-center gap-2 ">
              {!imageUrl ? (
                <Buildings size={16} />
              ) : (
                <img src={imageUrl} alt="" className="h-4" />
              )}
              <p className="flex  gap-2 items-center text-sm text-gray-500">{colaborador.instituicao}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
           {colaborador.lattes != '' && (
             <Link to={colaborador.lattes} target="_blank">  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><LinkSimple size={12}/>Currículo Lattes</div></Link>
           )}

{colaborador.linkedin != '' && (
             <Link to={colaborador.linkedin} target="_blank">  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><LinkedinIcon size={12}/>LinkedIn</div></Link>
           )}

{colaborador.email != '' && (
             <Link to={colaborador.email} target="_blank">  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Mail size={12}/>{colaborador.email}</div></Link>
           )}
            </div>

            {deletable && (
<Button onClick={handleDelete} className="w-full mt-8 hidden group-hover:flex transition-all" variant={'destructive'}><Trash size={16}/>Deletar</Button>
            )}
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
};
