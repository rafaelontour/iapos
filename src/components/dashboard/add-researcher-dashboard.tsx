import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import bg_popup from '../../assets/bg_popup.png';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronLeft, ChevronUp, Copy, Download, Info, Link, Maximize2, Plus, Trash, User } from "lucide-react";
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import { UserContext } from "../../context/context";
import { FileXls, MagnifyingGlass, Rows, SquaresFour, UserList } from "phosphor-react";
import { PesquisadorProps, columns } from "./columns";
import { useModal } from "../hooks/use-modal-store";
import { useModalDashboard } from "../hooks/use-modal-dashboard";
import { useLocation, useNavigate } from "react-router-dom";
import { DataTable } from "./data-table";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Helmet } from "react-helmet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home";
import { EditResearcherModal } from "../modals/edit-researcher-modal";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Badge } from "../ui/badge";

export function AddResearcherDashboard() {
    const [nomePesquisador, setNomePesquisador] = useState('');
    const [lattesID, setLattesID] = useState('');
    const [cpf, setCpf] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [count, setCount] = useState(24)

    const [typeVisu, setTypeVisu] = useState('block');
    const [updateFetch, setUpdateFetch] = useState(false)
    const { user, urlGeralAdm, permission } = useContext(UserContext);
    const { isOpen, type } = useModalDashboard();
    const isModalOpen = isOpen && type === 'researcher';
    const [researcher, setResearcher] = useState<PesquisadorProps[]>([]);
    const [status, setStatus] = useState('ativo')
    const [area, setArea] = useState("")
    const [focalPoint, setFocalPoint] = useState(false)

    const has_editar_pesquisadores = permission.some(
        (perm) => perm.permission === 'editar_pesquisadores'
    );


    const has_importar_bolsistas_cnpq = permission.some(
        (perm) => perm.permission === 'importar_bolsistas_cnpq'
    );

    console.log("PESQUISADOR: ", researcher);

    const areas = researcher
        .map(r => r.area)
        .filter((area): area is string => Boolean(area));

    const uniqueAreas = Array.from(new Set(areas)).sort();


    const handleVoltar = () => {

        const currentPath = location.pathname;
        const hasQueryParams = location.search.length > 0;

        if (hasQueryParams) {
            navigate(currentPath);
        } else {
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');

            if (pathSegments.length > 1) {
                pathSegments.pop();
                const previousPath = '/' + pathSegments.join('/');
                navigate(previousPath);
            } else {
                navigate('/');
            }
        }
    };



    const handleSubmitPesquisador = async () => {
        const docId = uuidv4();

        try {
            const data = [
                {
                    researcher_id: docId,
                    name: nomePesquisador,
                    lattes_id: lattesID,
                    cpf: cpf,
                    institution_id: user?.institution_id,
                    area: area,
                    focal_point: focalPoint,
                    status: status == "ativo" ? true : false,
                },
            ];

            let urlProgram = urlGeralAdm + "/ResearcherRest/Insert";

            const fetchData = async () => {
                if (nomePesquisador.length != 0) {
                    try {
                        const response = await fetch(urlProgram, {
                            mode: "cors",
                            method: "POST",
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "POST",
                                "Access-Control-Allow-Headers": "Content-Type",
                                "Access-Control-Max-Age": "3600",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });

                        const responseBody = await response.json();
                        if (response.ok) {
                            setLattesID("");
                            setNomePesquisador("");
                            setCpf("");
                            setArea("");
                            setFocalPoint(false);
                            fetchDataTable();
                            toast("Dados enviados com sucesso", {
                                description: "Pesquisador cadastrado na instituição",
                                action: {
                                    label: "Fechar",
                                    onClick: () => console.log("Undo"),
                                },
                            });
                        } else {
                            console.error("Erro do servidor:", responseBody);
                            if (response.status === 400) {
                                toast("Pesquisador já existe", {
                                    description: "Tente novamente",
                                    action: {
                                        label: "Fechar",
                                        onClick: () => console.log("Undo"),
                                    },
                                });
                            } else {
                                toast("Erro ao enviar os dados ao servidor", {
                                    description: "Tente novamente",
                                    action: {
                                        label: "Fechar",
                                        onClick: () => console.log("Undo"),
                                    },
                                });
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    if (nomePesquisador.length == 0 || (lattesID.length == 0 && cpf.length == 0)) {
                        toast("Parece que os campos estão vazios", {
                            description: "Preencha os campos nome do pesquisador e Lattes Id ou CPF",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        });
                    } else if (nomePesquisador.length == 0) {
                        toast("Preencha o nome do pesquisador", {
                            description: "Parece que o campo está vazio",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        });
                    }
                }
            };
            fetchData();
        } catch (error) {
            console.error("Erro ao processar a requisição:", error);
        }
    };


    // upload

    const urlGetResearcher = urlGeralAdm + `ResearcherRest/Query?institution_id=${user?.institution_id}`;

    const fetchDataTable = async () => {
        setLoading(true)
        try {
            const response = await fetch(urlGetResearcher, {
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '3600',
                    'Content-Type': 'text/plain',
                },
            });
            const data = await response.json();
            if (data) {
                setResearcher(data);
                setLoading(false)
                console.log('dataaaaaa', data)

            }
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    };



    const { onOpen, isOpen: isOpenModal, type: typeModal, data: dataModal } = useModal()

    const [carregado, setcarregado] = useState(true)
    useEffect(() => {
        if (carregado) {
            fetchDataTable();
        }
        setcarregado(false)

    }, [carregado]);

    useEffect(() => {
        if (typeModal === 'confirm-delete-researcher' && !isOpenModal) {
            fetchDataTable();
        }


    }, [isOpenModal, type]);


    useEffect(() => {
        if (updateFetch === true) {
            fetchDataTable();
            setUpdateFetch(false);
        }
    }, [updateFetch]);


    const history = useNavigate();



    const [onOpenAdd, setIsOpenAdd] = useState(false)
    const { version, urlGeral } = useContext(UserContext)


    const items = Array.from({ length: 12 }, (_, index) => (
        <Skeleton key={index} className="w-full rounded-md h-[200px]" />
    ));

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, "") // Remove tudo que não for número
            .slice(0, 11) // Garante que tenha no máximo 11 dígitos
            .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o traço
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(formatCPF(e.target.value));
    };


    const [search, setSearch] = useState('')
    const filteredTotal = Array.isArray(researcher) ? researcher.filter(item => {
        const normalizeString = (str) => str
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase();

        const searchString = normalizeString(item.name);
        const normalizedSearch = normalizeString(search);

        return (
            searchString.includes(normalizedSearch)

        );
    }) : [];


    const [isOn, setIsOn] = useState(true);

    const [jsonData, setJsonData] = useState<any[]>([]);


    const convertJsonToCsv = (json: any[]): string => {
        const items = json;
        const replacer = (_: string, value: any) => (value === null ? '' : value); // Handle null values
        const header = Object.keys(items[0]);
        const csv = [
            '\uFEFF' + header.join(';'), // Add BOM and CSV header
            ...items.map((item) =>
                header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
            ) // CSV data
        ].join('\r\n');

        return csv;
    };

    const handleDownloadJson = async () => {
        try {
            const csvData = convertJsonToCsv(jsonData);
            const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `dados.csv`;
            link.href = url;
            link.click();
        } catch (error) {
            console.error(error);
        }
    };
    /////


    const [profile, setProfile] = useState({
        img_perfil: '',
        img_background: '',
        institution_id: user?.institution_id || '',
        color: '',
        site: '',
        name: ''
    });


    const db = getFirestore();
    const storage = getStorage();
    const isDataLoaded = useRef(false); // Evita loops de salvamento

    // Carregar dados ao montar a página
    useEffect(() => {
        if (profile.institution_id) {
            const fetchInstitutionData = async () => {
                const docRef = doc(db, "institutions", profile.institution_id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    setProfile({
                        institution_id: data?.institution_id || '',
                        img_background: data?.img_background || "",
                        img_perfil: data?.img_perfil || "",
                        color: data?.color || "",
                        site: data?.site || "",
                        name: data?.name || ''
                    });

                    isDataLoaded.current = true; // Marca que os dados foram carregados
                } else {
                    console.log("Instituição não encontrada. Criando novo registro...");

                }
            };

            fetchInstitutionData();
        }
    }, [profile.institution_id]);

    return (
        <>

            <Helmet>
                <title>Pesquisadores | Módulo administrativo | {version ? ('Conectee') : ('Simcc')} </title>
                <meta name="description" content={`Pesquisadores | Módulo administrativo | ${version ? ('Conectee') : ('Simcc')}`} />
                <meta name="robots" content="index, follow" />
            </Helmet>
            {isModalOpen && (
                <main className="flex flex-1 flex-col ">

                    <div className="p-4 md:p-8 pb-0 md:pb-0">
                        <div className="w-full mb-4  gap-4">
                            <div className="flex items-center gap-4 mb-4">

                                <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Voltar</span>
                                </Button>

                                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                    Pesquisadores
                                </h1>




                                <Badge variant="outline" className="ml-auto gap-2 sm:ml-0">
                                    <img src={profile.img_perfil} className="w-8 " alt="" />   {`${profile.name}`}
                                </Badge>



                                <div className="hidden items-center h-10 gap-2 md:ml-auto md:flex">


                                    {version && (
                                        <Button size={'sm'}
                                            onClick={() => onOpen('import-docentes')}><FileXls size={16} />Importar dados UFMG</Button>
                                    )}
                                </div>
                            </div>

                        </div>


                    </div>
                    <div className="top-[68px] sticky z-[2] supports-[backdrop-filter]:dark:bg-neutral-900/60 supports-[backdrop-filter]:bg-neutral-50/60 backdrop-blur">
                        <div className={`w-full px-8  border-b border-b-neutral-200 dark:border-b-neutral-800`}>


                            {isOn && (
                                <div className="w-full   flex justify-between items-center">

                                    <div className="w-full pt-4  flex justify-between items-center">
                                        <Alert className="h-14  p-2 flex items-center justify-between  w-full">
                                            <div className="flex items-center gap-2 w-full flex-1">
                                                <MagnifyingGlass size={16} className=" whitespace-nowrap w-10" />
                                                <Input onChange={(e) => setSearch(e.target.value)} value={search} type="text" className="border-0 w-full " />

                                            </div>


                                        </Alert>
                                    </div>
                                </div>
                            )}




                            <div className={`flex w-full flex-wrap pt-2 pb-3 justify-between `}>
                                <div>

                                </div>

                                <div className="hidden xl:flex xl:flex-nowrap gap-2">
                                    <div className="md:flex md:flex-nowrap gap-2">

                                        <Button onClick={() => handleDownloadJson()} variant="ghost" className="">
                                            <Download size={16} className="" />
                                            Baixar resultado
                                        </Button>
                                    </div>

                                    <div>

                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOn(!isOn)}>
                                        {isOn ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gap-4 md:gap-8 md:p-8 p-4 flex flex-col ">



                        {has_editar_pesquisadores ? (
                            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                                <Alert className="p-0 bg-cover bg-no-repeat bg-center lg:col-span-3" style={{ backgroundImage: `url(${bg_popup})` }}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total de docentes
                                        </CardTitle>
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{filteredTotal.length}</div>
                                        <p className="text-xs text-muted-foreground">
                                            registrados
                                        </p>
                                    </CardContent>
                                </Alert>

                                <Alert onClick={() => setIsOpenAdd(!onOpenAdd)} className="p-0 hover:bg-eng-dark-blue bg-eng-blue dark:hover:bg-eng-dark-blue dark:bg-eng-blue text-white transition-all cursor-pointer "  >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">

                                        </CardTitle>
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>

                                    <CardContent>
                                        <h2 className="font-medium text-xl">Adicionar <br /> docente</h2>
                                    </CardContent>
                                </Alert>
                            </div>
                        ) : (
                            <Alert className="p-0 bg-cover bg-no-repeat bg-center lg:col-span-3" style={{ backgroundImage: `url(${bg_popup})` }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total de docentes
                                    </CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{filteredTotal.length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        registrados
                                    </p>
                                </CardContent>
                            </Alert>
                        )}


                        {onOpenAdd && (
                            <div className="grid gap-8">
                                <fieldset className="grid gap-6 rounded-lg  p-4 bg-white dark:border-neutral-800 border border-neutral-200 dark:bg-neutral-950 bg-cover  bg-center bg-no-repeat">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Adicionar pesquisador à instituição
                                    </legend>

                                    <div className="flex gap-3 items-end">
                                        <div className="flex flex-col space-y-1.5 w-full flex-1">
                                            <Label htmlFor="name">Nome completo</Label>
                                            <Input value={nomePesquisador} onChange={(e) => setNomePesquisador(e.target.value)} type="text" />
                                        </div>

                                        <div className="flex flex-col space-y-1.5 w-full flex-1">
                                            <Label htmlFor="lattes">Lattes Id</Label>
                                            <Input disabled={cpf.length > 0} value={lattesID} onChange={(e) => setLattesID(e.target.value)} type="text" />
                                        </div>

                                        <div className="flex flex-col space-y-1.5 w-full flex-1">
                                            <Label htmlFor="cpf">CPF</Label>
                                            <Input disabled={lattesID.length > 0} value={cpf} onChange={handleCpfChange} type="text" />
                                        </div>
                                        <div className="flex flex-col max-w-[250px] space-y-1.5 w-full flex-1">
                                            <Label htmlFor="status">Situação</Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ativo">Ativo</SelectItem>
                                                    <SelectItem value="inativo">Inativo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button onClick={() => handleSubmitPesquisador()} className="text-white dark:text-white">
                                            <Plus size={16} /> Adicionar
                                        </Button>

                                        <Button size={'icon'} onClick={() => onOpen('add-researcher-csv')} className="text-white dark:text-white">
                                            <FileXls size={16} />
                                        </Button>
                                    </div>
                                </fieldset>
                            </div>
                        )}

                        <div>
                            <Accordion defaultValue="item-1" type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <div className="flex mb-2">
                                        <HeaderResultTypeHome title="Todos os docentes" icon={<UserList size={24} className="text-gray-400" />}>
                                            <div className="hidden md:flex gap-3 mr-3">
                                                <Button onClick={() => setTypeVisu('rows')} variant={typeVisu === 'block' ? 'ghost' : 'outline'} size={'icon'}>
                                                    <Rows size={16} className="whitespace-nowrap" />
                                                </Button>
                                                <Button onClick={() => setTypeVisu('block')} variant={typeVisu === 'block' ? 'outline' : 'ghost'} size={'icon'}>
                                                    <SquaresFour size={16} className="whitespace-nowrap" />
                                                </Button>
                                            </div>
                                        </HeaderResultTypeHome>
                                        <AccordionTrigger>

                                        </AccordionTrigger>
                                    </div>
                                    <AccordionContent>
                                        {typeVisu === 'block' ? (
                                            loading ? (
                                                <ResponsiveMasonry
                                                    columnsCountBreakPoints={{
                                                        350: 2,
                                                        750: 3,
                                                        900: 4,
                                                        1200: 6,
                                                        1500: 6,
                                                        1700: 7
                                                    }}
                                                >
                                                    <Masonry gutter="16px">
                                                        {items.map((item, index) => (
                                                            <div key={index}>{item}</div>
                                                        ))}
                                                    </Masonry>
                                                </ResponsiveMasonry>
                                            ) : (
                                                <div>
                                                    <ResponsiveMasonry
                                                        columnsCountBreakPoints={{
                                                            350: 2,
                                                            750: 3,
                                                            900: 4,
                                                            1200: 6,
                                                            1500: 6,
                                                            1700: 7
                                                        }}
                                                    >

                                                        <Masonry gutter="16px">
                                                            {filteredTotal.slice(0, count).map((props: any) => {

                                                                return (
                                                                    <div onClick={() => onOpen('researcher-modal', { name: props.name })} className="flex group min-h-[300px] w-full cursor-pointer">
                                                                        <Alert className="flex p-0 flex-col flex-1 gap-4 bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url("${urlGeral}ResearcherData/Image?name=${props.name}")` }}>
                                                                            <div className="bg-[#000000] rounded-md bg-opacity-30 hover:bg-opacity-70 transition-all absolute w-full h-full rounded-t-md ">
                                                                                <div className="flex flex-col justify-between h-full">
                                                                                    <div className=" p-4 flex justify-between items-start">
                                                                                        <div className="flex group-hover:hidden">
                                                                                            <div className="flex text-white gap-2 items-center" >
                                                                                                <div className={` rounded-md h-4 w-4 ${props.status ? ('bg-green-500') : ('bg-red-500')}`}></div>
                                                                                                <div className="flex-1 flex">{props.status ? ('Ativo') : ('Inativo')}</div></div>
                                                                                        </div>

                                                                                        <div className="z-[1] w-full  flex gap-3 justify-end">
                                                                                            <div className="flex gap-3">


                                                                                                <Button onClick={(event) => {
                                                                                                    event.stopPropagation();
                                                                                                    onOpen('confirm-delete-researcher', { id_delete: props.researcher_id, name: props.name, updateFetch, setUpdateFetch })
                                                                                                }} variant={'destructive'} className="h-8 w-8 p-0 text-white hidden group-hover:flex dark:text-white">

                                                                                                    <Trash size={8} className="h-4 w-4" />
                                                                                                </Button>

                                                                                                <Button onClick={(event) => {
                                                                                                    event.stopPropagation();
                                                                                                    navigator.clipboard.writeText(props.lattes_id)

                                                                                                    toast("Operação realizada", {
                                                                                                        description: "ID Lattes copiado para área de transferência",
                                                                                                        action: {
                                                                                                            label: "Fechar",
                                                                                                            onClick: () => console.log("Undo"),
                                                                                                        },
                                                                                                    })

                                                                                                }} variant={'outline'} className="h-8 w-8 p-0  hidden group-hover:flex">
                                                                                                    <Copy size={16} />
                                                                                                </Button>

                                                                                                <EditResearcherModal
                                                                                                    uniqueAreas={uniqueAreas}
                                                                                                    researcher_id={props.researcher_id}
                                                                                                    name={props.name}
                                                                                                    lattes_id={props.lattes_id}
                                                                                                    institution_id={props.institution_id}
                                                                                                    status={props.status}
                                                                                                    area={props.area}
                                                                                                    focal_point={props.focal_point} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>


                                                                                    <div className="flex gap-2 px-6 flex-col pb-6  w-full h-full text-white justify-end  ">
                                                                                        <div className="flex gap-1 flex-col">


                                                                                            <CardTitle className="text-lg font-medium">{props.name}</CardTitle>

                                                                                            <div className="group-hover:flex hidden items-center flex-wrap gap-1  mb-2">
                                                                                                <div className="flex gap-1 text-sm  items-center ">{props.lattes_id}</div>


                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Alert>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Masonry>
                                                    </ResponsiveMasonry>

                                                    {filteredTotal.length > count && (
                                                        <div className="w-full flex justify-center mt-8"><Button onClick={() => setCount(count + 24)}><Plus size={16} />Mostrar mais</Button></div>
                                                    )}
                                                </div>
                                            )
                                        ) : (
                                            loading ? (
                                                <Skeleton className="w-full rounded-md h-[400px]" />
                                            ) : (
                                                <DataTable columns={columns} data={filteredTotal} />
                                            )
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                    </div>


                </main>
            )}
        </>
    )
}