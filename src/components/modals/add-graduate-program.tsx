import {

  DialogHeader,

} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

interface City {
  id: number;
  nome: string;
  municipio: {
    nome: string;
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: string; // Pegando a sigla do estado corretamente
        };
      };
    };
  };
}


import { useModal } from "../hooks/use-modal-store";
import { useContext, useState } from "react";
import { UserContext } from "../../context/context";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import { toast } from "sonner"
import { Button } from "../ui/button";
import { Plus, X } from "phosphor-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Sheet,
  SheetContent,

} from "../../components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function AddGraduateProgram() {

  const { onClose, isOpen, type: typeModal } = useModal();
  const isModalOpen = isOpen && typeModal === "add-graduate-program";

  const { user, urlGeralAdm } = useContext(UserContext);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [modality, setModality] = useState('');
  const [type, setType] = useState('');
  const [ranking, setRanking] = useState('');
  const [area, setArea] = useState('');
  const [code, setCode] = useState('');
  const [descricao, setDescricao] = useState('');
  const [site, setSite] = useState('');
  const [sigla, setSigla] = useState('');

   const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  
  // Função para buscar cidades conforme o usuário digita
  async function fetchCities(query: string) {
    if (query.length < 3) return; // Só busca se houver pelo menos 3 letras
    try {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/distritos`
      );
      const data: City[] = await res.json();
      const filtered = data.filter((city) =>
        city.nome.toLowerCase().includes(query.toLowerCase())
      );
      setCities(filtered);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
    }
  }



  const handleSubmit = async () => {

    const docId = uuidv4();

    try {
      const data = [
        {
          graduate_program_id: docId,
          code: code,
          name: name.toUpperCase(),
          area: area.toUpperCase(),
          modality: modality.toUpperCase(),
          type: type.toUpperCase(),
          rating: ranking.toUpperCase(),
          institution_id: user?.institution_id,
          description: descricao,
          url_image: '',
          city: city,
          visible: false,
          acronym: sigla,
          site: site
        }
      ]

      const urlProgram = urlGeralAdm + '/GraduateProgramRest/Insert'

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
                description: "Programa de pós-graduação cadastrado na instituição",
                action: {
                  label: "Fechar",
                  onClick: () => console.log("Undo"),
                },
              })

              onClose()

            } else {
              console.error('Erro ao enviar dados para o servidor.');
              toast("Tente novamente!", {
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
        <DialogHeader className="h-[50px] px-4 justify-center border-b dark:border-b-neutral-600">

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
              Adicionar programa
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
                <Select onValueChange={(value) => setModality(value)}>
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
                <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCity ? `${selectedCity.nome} (${selectedCity.municipio.microrregiao.mesorregiao.UF.sigla})` : "Selecione uma cidade"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-2">
        <Input
          placeholder="Digite o nome da cidade..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchCities(e.target.value);
          }}
        />
        <ScrollArea className="h-60 mt-2 border rounded-md">
          {cities.length > 0 ? (
            cities.map((city) => (
              <div
                key={city.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => {
                  setSelectedCity(city);
                  setOpen(false);
                }}
              >
                {city.nome} ({city.municipio.microrregiao.mesorregiao.UF.sigla})
                {selectedCity?.id === city.id && <Check className="h-4 w-4 text-green-500" />}
              </div>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-500">Nenhuma cidade encontrada</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
              </div>
            </div>

            <div className="mt-4 gap-4 flex">
              <div className="flex flex-col gap-2 w-1/2">
                <Label>Tipo de programa*</Label>
                <Select onValueChange={(value) => setType(value)}>
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
                  <Select value={area} onValueChange={(value) => setArea(value)}>
  <SelectTrigger id="area" className="items-start [&_[data-description]]:hidden">
    <SelectValue placeholder="" className={'whitespace-nowrap'} />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Ciências Agrárias</SelectLabel>
      
      {/* Ciências Agrárias */}
      <SelectItem value="ciencia_alimentos">Ciência de Alimentos</SelectItem>
      <SelectItem value="ciencias_agrarias1">Ciências Agrárias I</SelectItem>
      <SelectItem value="medicina_veterinaria">Medicina Veterinária</SelectItem>
      <SelectItem value="zootecnia_pesqueiros">Zootecnia / Recursos Pesqueiros</SelectItem>
      <SelectLabel>Ciências Biológicas</SelectLabel>
      {/* Ciências Biológicas */}
      <SelectItem value="biodiversidade">Biodiversidade</SelectItem>
      <SelectItem value="ciencias_biologicas1">Ciências Biológicas I</SelectItem>
      <SelectItem value="ciencias_biologicas2">Ciências Biológicas II</SelectItem>
      <SelectItem value="ciencias_biologicas3">Ciências Biológicas III</SelectItem>

      {/* Ciências da Saúde */}
      <SelectLabel>Ciências da Saúde</SelectLabel>
      <SelectItem value="educacao_fisica">Educação Física, Fisioterapia e Terapia Ocupacional</SelectItem>
      <SelectItem value="enfermagem">Enfermagem</SelectItem>
      <SelectItem value="farmacia">Farmácia</SelectItem>
      <SelectItem value="medicina1">Medicina I</SelectItem>
      <SelectItem value="medicina2">Medicina II</SelectItem>
      <SelectItem value="medicina3">Medicina III</SelectItem>
      <SelectItem value="nutricao">Nutrição</SelectItem>
      <SelectItem value="odontologia">Odontologia</SelectItem>
      <SelectItem value="saude_coletiva">Saúde Coletiva</SelectItem>
     
      <SelectLabel>Ciências Humanas</SelectLabel>
      {/* Ciências Humanas */}
      <SelectItem value="antropologia">Antropologia / Arqueologia</SelectItem>
      <SelectItem value="ciencia_politica">Ciência Política e Relações Internacionais</SelectItem>
      <SelectItem value="educacao">Educação</SelectItem>
      <SelectItem value="filosofia">Filosofia</SelectItem>
      <SelectItem value="geografia">Geografia</SelectItem>
      <SelectItem value="historia">História</SelectItem>
      <SelectItem value="psicologia">Psicologia</SelectItem>
      <SelectItem value="sociologia">Sociologia</SelectItem>
      
      <SelectLabel>Ciências Sociais Aplicadas</SelectLabel>
      {/* Ciências Sociais Aplicadas */}
      <SelectItem value="administracao">Administração e Turismo</SelectItem>
      <SelectItem value="arquitetura">Arquitetura e Urbanismo</SelectItem>
      <SelectItem value="direito">Direito</SelectItem>
      <SelectItem value="economia">Economia</SelectItem>
      <SelectItem value="servico_social">Serviço Social</SelectItem>

      <SelectLabel>Linguística, Letras e Artes</SelectLabel>
      {/* Linguística, Letras e Artes */}
      <SelectItem value="artes">Artes</SelectItem>
      <SelectItem value="linguistica">Linguística e Literatura</SelectItem>

      {/* Ciências Exatas e da Terra */}
      <SelectLabel>Ciências Exatas e da Terra</SelectLabel>
      <SelectItem value="astronomia">Astronomia / Física</SelectItem>
      <SelectItem value="computacao">Computação</SelectItem>
      <SelectItem value="geociencias">Geociências</SelectItem>
      <SelectItem value="matematica">Matemática / Estatística</SelectItem>
      <SelectItem value="quimica">Química</SelectItem>

      {/* Engenharias */}
      <SelectLabel>Engenharias</SelectLabel>
      <SelectItem value="engenharias1">Engenharias I</SelectItem>
      <SelectItem value="engenharias2">Engenharias II</SelectItem>
      <SelectItem value="engenharias3">Engenharias III</SelectItem>
      <SelectItem value="engenharias4">Engenharias IV</SelectItem>

      {/* Multidisciplinar */}
      <SelectLabel>Multidisciplinar</SelectLabel>
      <SelectItem value="biotecnologia">Biotecnologia</SelectItem>
      <SelectItem value="ciencias_ambientais">Ciências Ambientais</SelectItem>
      <SelectItem value="ensino">Ensino</SelectItem>
      <SelectItem value="interdisciplinar">Interdisciplinar</SelectItem>
      <SelectItem value="materiais">Materiais</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

                </div>

                <div className="flex flex-col gap-2 w-1/3">
                  <Label>Nota</Label>
                  <Input value={ranking} onChange={(e) => setRanking(e.target.value)} type="text" />
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
              <Plus size={16} className="" />Adicionar
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}