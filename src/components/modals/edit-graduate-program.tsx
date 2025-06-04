import {

  DialogHeader,

} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

import { useModal } from "../hooks/use-modal-store";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/context";
import { toast } from "sonner"
import { Button } from "../ui/button";
import { PencilSimple } from "phosphor-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Sheet, SheetContent } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";

export function EditGraduateProgram() {

  const { onClose, isOpen, type: typeModal, data } = useModal();
  const isModalOpen = isOpen && typeModal === "edit-graduate-program";

  const { user, urlGeralAdm } = useContext(UserContext);

  const [id_program, setIdProgram] = useState(data && data.graduate_program_id)

  const [name, setName] = useState(data && data.name);
  const [city, setCity] = useState(data && data.city);
  const [modality, setModality] = useState(data && data.modality);
  const [type, setType] = useState(data && data.type);
  const [ranking, setRanking] = useState(data && data.rating);
  const [area, setArea] = useState(data && data.area);
  const [code, setCode] = useState(data && data.code);
  const [descricao, setDescricao] = useState(data && data.description);
  const [site, setSite] = useState(data && data.site);
  const [sigla, setSigla] = useState(data && data.acronym);
  const [visible, setVisible] = useState(data && data.visible);

  useEffect(() => {
    setName(data.name)
    setCity(data.city)
    setModality(data.modality)
    setType(data.type)
    setRanking(data.rating)
    setArea(data.area)
    setCode(data.code)
    setIdProgram(data.graduate_program_id)
    setDescricao(data.description)
    setSigla(data.acronym)
    setSite(data.site)
    setVisible(data.visible)
  }, [data]);

  const handleSubmit = async () => {



    try {
      const data = [
        {
          graduate_program_id: id_program,
          code: code,
          name: name ? name.toUpperCase() : '',
          area: area ? area.toUpperCase() : '',
          modality: modality ? modality.toUpperCase() : '',
          type: type ? type.toUpperCase() : '',
          rating: ranking ? ranking.toUpperCase() : '',
          institution_id: user?.institution_id,
          description: descricao,
          url_image: '',
          city: city ? city : '',
          visible: visible,
          acronym: sigla,
          site: site
        }
      ]

      let urlProgram = urlGeralAdm + '/GraduateProgramRest/Fix'


      const fetchData = async () => {

        if (name == '') {
          toast("Campo 'Nome do programa' vazio", {
            description: "Preencha o campo",
            action: {
              label: "Fechar",
              onClick: () => console.log("Undo"),
            },
          })
        } else if (area == '') {
          toast("Campo 'Área' vazio", {
            description: "Preencha o campo",
            action: {
              label: "Fechar",
              onClick: () => console.log("Undo"),
            },
          })
        } else if (modality == '') {
          toast("Campo 'Modalidade' vazio", {
            description: "Preencha o campo",
            action: {
              label: "Fechar",
              onClick: () => console.log("Undo"),
            },
          })
        } else if (type == '') {
          toast("Campo 'Tipo do programa' vazio", {
            description: "Preencha o campo",
            action: {
              label: "Fechar",
              onClick: () => console.log("Undo"),
            },
          })
        } else if (city == '') {
          toast("Campo 'Cidade' vazio", {
            description: "Preencha o campo",
            action: {
              label: "Fechar",
              onClick: () => console.log("Undo"),
            },
          })
        } else if (city != '' && type != '' && modality != '' && area != '' && name != '') {
          try {
            const response = await fetch(urlProgram, {
              mode: 'cors',
              method: 'POST',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data),
            });

            if (response.ok) {

              toast("Dados enviados com sucesso", {
                description: "Programa de pós-graduação atualizado na instituição",
                action: {
                  label: "Fechar",
                  onClick: () => console.log("Undo"),
                },
              })

              onClose()

            } else {
              console.error('Erro ao enviar dados para o servidor.');
              toast("Tente novamente", {
                description: "Tente novamente",
                action: {
                  label: "Fechar",
                  onClick: () => console.log("Undo"),
                },
              })
            }

          } catch (err) {
            console.log(err);
          }
        }
      };
      fetchData();

      if (city != '' && type != '' && modality != '' && area != '' && name != '') {
        onClose()
        setName('')
        setArea('')
        setCity('')
        setCode('')
        setDescricao('')
        setModality('')
        setRanking('')
        setType('')
        setSigla('')
        setSite('')
        setVisible('')
      }


    } catch (error) {
      toast("Erro ao processar requisição", {
        description: "Tente novamente",
        action: {
          label: "Fechar",
          onClick: () => console.log("Undo"),
        },
      })
    }
  };

  return (
    <Sheet open={isModalOpen} onOpenChange={onClose}>
      <SheetContent className={`p-0 dark:bg-neutral-900 dark:border-gray-600 min-w-[50vw]`}>
        <DialogHeader className="h-[50px] px-4 justify-center border-b">

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-8 w-8" variant={'outline'} onClick={() => onClose()} size={'icon'}><X size={16} /></Button>
                </TooltipTrigger>
                <TooltipContent> Fechar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

        </DialogHeader>

        <ScrollArea className="relative pb-4 whitespace-nowrap h-[calc(100vh-50px)] p-8 ">
          <div className="mb-8">
            <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
              Programas de pós-graduação
            </p>

            <h1 className="max-w-[500px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
              Editar programa
            </h1>
          </div>

          <div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 mt-4 w-2/3">
                <Label>Nome do programa*</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} type="text" />
              </div>

              <div className="flex flex-col gap-2 mt-4 w-1/3">
                <Label>Sigla*</Label>
                <Input value={sigla} onChange={(e) => setSigla(e.target.value)} type="text" />
              </div>
            </div>

            <div className="mt-4 gap-4 grid grid-cols-2">
              <div className="flex flex-col gap-2 w-full">
                <Label>Modalidade*</Label>
                <Select defaultValue={modality} value={modality} onValueChange={(value) => setModality(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACADÊMICO">Acadêmico</SelectItem>
                    <SelectItem value="PROFISSIONAL">Profissional</SelectItem>

                  </SelectContent>
                </Select>

              </div>

              <div className="flex flex-col gap-2">
                <Label>Cidade*</Label>
                <Input defaultValue={city} value={city} onChange={(e) => setCity(e.target.value)} type="text" />
              </div>
            </div>

            <div className="mt-4 gap-4 flex">
              <div className="flex flex-col gap-2 w-1/2">
                <Label>Tipo de programa*</Label>
                <Select defaultValue={type} value={type} onValueChange={(value) => setType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOUTORADO">Doutorado</SelectItem>
                    <SelectItem value="MESTRADO">Mestrado</SelectItem>

                  </SelectContent>
                </Select>

              </div>

              <div className="w-1/2 flex gap-4">
                <div className="flex flex-col gap-2 w-2/3">
                  <Label>Área*</Label>
                  <Input value={area} defaultValue={area} onChange={(e) => setArea(e.target.value)} type="text" />
                </div>

                <div className="flex flex-col gap-2 w-1/3">
                  <Label>Nota</Label>
                  <Input defaultValue={ranking} value={ranking} onChange={(e) => setRanking(e.target.value)} type="text" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex flex-col gap-2  w-2/3">
                <Label>Código do programa (Sucupira)</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} type="text" />
              </div>

              <div className="flex flex-col gap-2 w-1/3">
                <Label>Site</Label>
                <Input value={site} onChange={(e) => setSite(e.target.value)} type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full mt-4">
              <Label htmlFor="dep_des" className="h-fit">Descrição</Label>
              <Textarea
                name="dep_des"
                className="h-full"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                id="dep_des"
              />
            </div>

            <Button onClick={() => handleSubmit()} size={'sm'} className="text-white dark:text-white mt-3 ml-auto flex ">
              <PencilSimple size={16} className="" />Editar programa
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}