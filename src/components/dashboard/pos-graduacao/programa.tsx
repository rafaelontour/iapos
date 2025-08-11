import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../../context/context"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "../builder-page/tabelas/tabela-artigos";
import { Button } from "../../ui/button";
import { Blocks, Briefcase, Calendar, ChevronLeft, GraduationCap, Home, LoaderCircle, MapPinIcon, PencilLine, SquareArrowOutUpRight, Star, Trash, Undo2, Upload, User, Users } from "lucide-react";
import { LogoConecteeWhite } from "../../svg/LogoConecteeWhite";
import { LogoConectee } from "../../svg/LogoConectee";
import { useTheme } from "next-themes";
import { LogoIaposWhite } from "../../svg/LogoIaposWhite";
import { LogoIapos } from "../../svg/LogoIapos";
import { Helmet } from "react-helmet";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { BuilderPage, Keepo } from "../builder-page/builder-page";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Tabs, TabsContent, TabsList } from "../../ui/tabs";
import { Alert } from "../../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { Gear } from "phosphor-react";
import { useModalSecundary } from "../../hooks/use-modal-store-secundary";
import { DocentesGraduate } from "../components/docentes-graduate";
import { DiscentesGraduate } from "../components/discentes-graduate";
import { useModal } from "../../hooks/use-modal-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface PosGraduationsProps {
    graduate_program_id: string
    code: string
    name: string
    area: string
    modality: string
    type: string
    rating: string
    institution_id: string
    description: string
    url_image: string
    city: string
    created_at: string
    visible: boolean
    updated_at: string
    qtd_discente: string
    qtd_colaborador: string
    qtd_permanente: string
    state: string

    researchers: string[]
    acronym: string

    name_en: string;
    cooperation_project: string;
    basic_area: string;
    site: string;
    coordinator: string;
    email: string;
    start: string;
    phone: string;
    periodicity: string;
}

export function ProgramaDashboard() {
    const { urlGeral, itemsSelecionados, version, searchType, permission, urlGeralAdm } = useContext(UserContext)

    const location = useLocation();


    const queryUrl = useQuery();
    const type_search = queryUrl.get('graduate_program_id');
    const handleVoltar = () => {

        const currentPath = location.pathname;
        const hasQueryParams = location.search.length > 0;

        if (hasQueryParams) {
            // Se tem query parameters, remove apenas eles
            navigate(currentPath);
        } else {
            // Se não tem query parameters, remove o último segmento do path
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');

            if (pathSegments.length > 1) {
                pathSegments.pop();
                const previousPath = '/' + pathSegments.join('/');
                navigate(previousPath);
            } else {
                // Se estiver na raiz ou com apenas um segmento, vai para raiz
                navigate('/');
            }
        }
    };

    const [loading, setLoading] = useState(true);
    const [graduatePrograms, setGraduatePrograms] = useState<PosGraduationsProps>();

    let urlPatrimonioInsert = `${urlGeralAdm}GraduateProgramRest/Query?graduate_program_id=${type_search}`
    const token = localStorage.getItem('jwt_token');
    console.log(urlPatrimonioInsert)

    const fetchData = async () => {

        try {

            const response = await fetch(urlPatrimonioInsert, {
                mode: "cors",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Max-Age": "3600",
                    "Content-Type": "text/plain",
                },
            });
            const data = await response.json();
            if (data) {
                setGraduatePrograms(data[0]);
                setLoading(false)
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)
        }
    };

    const { onOpen } = useModalSecundary()

    const { onOpen: onOpenModal, type: typeModal, isOpen: isOpenModal } = useModal()



    useEffect(() => {

        fetchData();
    }, []);

    const [updateFetch, setUpdateFetch] = useState(false)


    useEffect(() => {
        if (updateFetch === true) {
            fetchData();
            setUpdateFetch(false);
        }
    }, [updateFetch]);

    const [carregado, setcarregado] = useState(true)

    useEffect(() => {
        if (carregado) {
            fetchData();
        }
        setcarregado(false)

    }, [carregado]);

    useEffect(() => {
        if (typeModal === 'edit-departamento' && !isOpenModal) {
            fetchData();
        }

    }, [isOpenModal, typeModal]);

    const { theme } = useTheme()

    const tabs = [
        { id: "docentes", label: "Docentes", icon: Users },
        { id: "discentes", label: "Discentes", icon: Users },
    ];

    const tab = queryUrl.get('pagina');


    const [value, setValue] = useState(tab || tabs[0].id)

    const navigate = useNavigate();

    const updateFilters = (category: string, values: any) => {
        if (values) {
            queryUrl.set(category, values);
        } else {
            queryUrl.delete(category)
        }
    };


    useEffect(() => {
        updateFilters("pagina", value);
        navigate({
            pathname: location.pathname,
            search: queryUrl.toString(),
        })
    }, [value]);


    const siteTitle = graduatePrograms?.name
        ? `${graduatePrograms.name} | ${version ? "Conectee" : "Simcc"}`
        : `${version ? "Conectee" : "Simcc"} | ${version ? "Escola de Engenharia UFMG" : "SECTI-BA"}`;

    const siteDescription = graduatePrograms?.name
        ? `${graduatePrograms.name} | Conectee`
        : `${version ? "Conectee" : "Simcc"} | ${version ? "Escola de Engenharia UFMG" : "SECTI-BA"}`;

    const [loadingMessage, setLoadingMessage] = useState("Estamos procurando todas as informações no nosso banco de dados, aguarde.");

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        setLoadingMessage("Estamos procurando todas as informações no nosso banco de dados, aguarde.");

        timeouts.push(setTimeout(() => {
            setLoadingMessage("Estamos quase lá, continue aguardando...");
        }, 5000));

        timeouts.push(setTimeout(() => {
            setLoadingMessage("Só mais um pouco...");
        }, 10000));

        timeouts.push(setTimeout(() => {
            setLoadingMessage("Está demorando mais que o normal... estamos tentando encontrar tudo.");
        }, 15000));

        timeouts.push(setTimeout(() => {
            setLoadingMessage("Estamos empenhados em achar todos os dados, aguarde só mais um pouco");
        }, 15000));

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, []);

    const [keepoData, setKeepoData] = useState<Keepo>({
        app: {
            background_color: "",
            background_image: '',
            text_color: "",
            status: "publicar",
            card_color: "",
            card_text_color: "",
            button_color: "",
            button_text_color: "",
        },
        profile_info: {
            avatar: "",
            firstName: "",
            lastName: "",
            email: "",
            jobTitle: "",
            supporting: "",
            button_text: "",
            link: "",
        },
        content: [],
    });


    const graduate_program_id = queryUrl.get('graduate_program_id');
    const group_id = queryUrl.get('group_id');
    const dep_id = queryUrl.get('dep_id');

    const documentId = graduate_program_id || group_id || dep_id;

    const db = getFirestore();
    const isDataLoaded = useRef(false);

    useEffect(() => {
        if (documentId) {
            const fetchData = async () => {
                const docRef = doc(db, "construtor-pagina", documentId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as Partial<Keepo>;
                    setKeepoData({
                        app: {
                            background_color: data.app?.background_color || "",
                            background_image: data.app?.background_image || "",
                            text_color: data.app?.text_color || "",
                            card_color: data.app?.card_color || "",
                            card_text_color: data.app?.card_text_color || "",
                            button_color: data.app?.button_color || "",
                            button_text_color: data.app?.button_text_color || "",
                            status: data.app?.status || "",
                        },
                        profile_info: {
                            avatar: data.profile_info?.avatar || "",
                            firstName: data.profile_info?.firstName || "",
                            lastName: data.profile_info?.lastName || "",
                            email: data.profile_info?.email || "",
                            jobTitle: data.profile_info?.jobTitle || "",
                            supporting: data.profile_info?.supporting || "",
                            button_text: data.profile_info?.button_text || "",
                            link: data.profile_info?.link || "",
                        },
                        content: data.content || [],
                    });

                    isDataLoaded.current = true;
                }
            };
            fetchData();
        }
    }, [documentId]);

    const storage = getStorage();
    const handleUpload = async (folder: "profile" | "background") => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();
        fileInput.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const storageRef = ref(storage, `/${folder}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setKeepoData((prev) => ({
                ...prev,
                app: {
                    ...prev.app,
                    background_image: folder === "background" ? downloadURL : prev.app.background_image,
                },
                profile_info: {
                    ...prev.profile_info,
                    avatar: folder === "profile" ? downloadURL : prev.profile_info.avatar,
                },
            }));
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-full flex flex-col items-center justify-center h-full">
                    <div className="text-eng-blue mb-4 animate-pulse">
                        <LoaderCircle size={108} className="animate-spin" />
                    </div>
                    <p className="font-medium text-lg max-w-[500px] text-center">
                        {loadingMessage}
                    </p>
                </div>
            </div>
        );
    }

    if (!graduatePrograms) {
        return (
            <div className="h-full bg-cover bg-center flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                {version ? (
                    <Link to="/" className="absolute top-16">
                        {theme === "dark" ? <LogoConecteeWhite /> : <LogoConectee />}
                    </Link>
                ) : (
                    <Link to="/" className="absolute top-16">
                        {theme === "dark" ? <LogoIaposWhite /> : <LogoIapos />}
                    </Link>
                )}

                <div className="w-full flex flex-col items-center justify-center">
                    <p className="text-9xl text-[#719CB8] font-bold mb-16 animate-pulse">
                        (⊙_⊙)
                    </p>
                    <h1 className="text-center text-2xl md:text-4xl text-neutral-400 font-medium leading-tight tracking-tighter lg:leading-[1.1] ">
                        Não foi possível acessar as <br />  informações deste programa.
                    </h1>
                    <div className="flex gap-3 mt-8">
                        <Button onClick={handleVoltar} variant={'ghost'}><Undo2 size={16} /> Voltar</Button>
                        <Link to={'/'}> <Button><Home size={16} /> Página Inicial</Button></Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={siteDescription} />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <main className="grid grid-cols-1 ">
                <Tabs value={value} onValueChange={setValue}>
                    <div className="md:p-8 p-4 pb-0">
                        <div style={{ backgroundImage: `url(${keepoData.app.background_image})` }} className="bg-eng-blue bg-no-repeat bg-center bg-cover border dark:border-neutral-800 w-full rounded-md h-[300px]">
                            <div className={`w-full h-full rounded-md ${!(keepoData.app.background_image == "") && ('bg-black/25 ')}  pb-0 md:pb-0 p-4 md:p-8 flex-col flex justify-between `}>
                                <div
                                    className="
                                        flex flex-col items-center gap-4 justify-between

                                        md:flex-row
                                    "
                                >
                                    <div className="flex gap-2">
                                        <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7 text-eng-blue hover:text-eng-blue">
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="sr-only">Voltar</span>
                                        </Button>
                                        <div className="flex flex-col gap-4 md:flex-col lg:flex-row">
                                            <h1 className="flex-1 shrink-0 text-white whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                                Pós-graduação
                                            </h1>
                                            {graduatePrograms.researchers.length > 0 && (
                                                <div className=" hidden justify-between items-center md:flex">
                                                    <div className="flex items-center ">
                                                        {graduatePrograms.researchers.slice(0, 5).map((item, index) => (
                                                            <Avatar key={item} onClick={(event) => { event.stopPropagation(); onOpenModal('researcher-modal', { name: item }); }}
                                                                className="cursor-pointer rounded-full relative border dark:border-neutral-800 h-8 w-8 hover:z-10 transition-transform hover:scale-110"
                                                                style={{ marginLeft: index > 0 ? '-10px' : '0px' }}>
                                                                <AvatarImage className="rounded-md h-8 w-8"
                                                                    src={`${urlGeral}ResearcherData/Image?name=${item}`}
                                                                />
                                                                <AvatarFallback className="flex items-center justify-center">
                                                                    <User size={16} />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ))}

                                                        {graduatePrograms.researchers.length > 5 && (
                                                            <div
                                                                className="h-8 w-8 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-neutral-800 rounded-full border dark:border-neutral-700 text-xs font-medium"
                                                                style={{ marginLeft: '-10px' }}
                                                            >
                                                                +{graduatePrograms.researchers.length - 5}
                                                            </div>
                                                        )}
                                                    </div>


                                                </div>

                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="
                      flex items-center gap-2 flex-wrap
                    "
                                    >

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button onClick={() => onOpenModal('confirm-delete-pos-graduate-program', { id_delete: graduatePrograms.graduate_program_id, name: graduatePrograms.name })} variant='destructive' size="icon" className="h-8 w-8"  >
                                                    <Trash size={16} />
                                                    <span className="sr-only">Arquivar</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Deletar programa</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link to={`/pos-graduacao?graduate_program_id=${graduatePrograms.graduate_program_id}`} target="_blank">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-eng-blue hover:text-eng-blue"   >
                                                        <SquareArrowOutUpRight size={16} />
                                                        <span className="sr-only">Arquivar</span>
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>Visualizar página</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 text-eng-blue hover:text-eng-blue"
                                                    onClick={() =>
                                                        onOpenModal('edit-graduate-program', {
                                                            ...graduatePrograms,
                                                            updateFetch,
                                                            setUpdateFetch,
                                                        })
                                                    }
                                                >
                                                    <PencilLine size={16} />
                                                </Button>

                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="icon" onClick={() => onOpen('editor-page')} className="h-8 w-8 text-eng-blue hover:text-eng-blue">
                                                    <Gear size={16} />
                                                </Button>

                                            </TooltipTrigger>
                                            <TooltipContent>Configurações</TooltipContent>
                                        </Tooltip>

                                        <Button variant="outline" size="sm" onClick={() => handleUpload("background")} className="h-8 text-eng-blue hover:text-eng-blue">
                                            <Upload size={16} /> Alterar imagem
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-end items-end flex-1 w-full ">
                                    <div className="flex justify-between w-full gap-8">


                                        <div className="absolute">
                                            <div className="relative group">
                                                <Alert
                                                    className="aspect-square -top-12 xl:top-0  bg-no-repeat bg-center bg-contain rounded-lg h-24 bg-white dark:bg-neutral-900"
                                                    style={{ backgroundImage: `url(${keepoData.profile_info.avatar})` }}
                                                ></Alert>
                                                <div
                                                    className="aspect-square rounded-md h-24 group-hover:flex bg-black/20 items-center justify-center absolute hidden top-0 z-[1] cursor-pointer"
                                                    onClick={() => handleUpload("profile")}
                                                >
                                                    <Upload size={20} />
                                                </div>
                                            </div>

                                        </div>


                                        <div className="  w-24 min-w-24">

                                        </div>

                                        <div className="relative  grid-cols-1 hidden xl:grid">
                                            <ScrollArea className="relative overflow-x-auto">
                                                <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent">
                                                    {tabs.map(
                                                        ({ id, label, icon: Icon }) =>

                                                            <div
                                                                key={id}
                                                                className={`pb-2 border-b-2 text-black dark:text-white transition-all ${value === id ? "border-b-white dark:border-b-neutral-800" : "border-b-transparent"
                                                                    }`}
                                                                onClick={() => setValue(id)}
                                                            >
                                                                <Button variant="ghost" className={`m-0 text-white hover:text-eng-blue dark:hover:text-eng-blue ${value === id ? "bg-white dark:bg-neutral-800 text-eng-blue" : ""}`}>
                                                                    <Icon size={16} />
                                                                    {label}
                                                                </Button>
                                                            </div>

                                                    )}
                                                </TabsList>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>

                                            <div>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>



                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-8  z-[2] pt-8 md:p-0">

                        <div className="flex justify-between  md:px-8 items-center ">
                            <div className="flex flex-col  gap-6 mt-8 px-8">


                                <div>
                                    <h1 className="text-2xl mb-2 max-w-[800px] font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
                                        {graduatePrograms.name}
                                    </h1>

                                    {graduatePrograms.name_en && (
                                        <h1 className="text-lg mb-2 max-w-[800px] font-bold leading-tight tracking-tighter md:text-2xl lg:leading-[1.1] md:block">
                                            {graduatePrograms.name_en}
                                        </h1>
                                    )}

                                    <p className=" text-lg font-light text-foreground">
                                        <div className="flex flex-wrap gap-4 ">
                                            <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><GraduationCap size={12} />{graduatePrograms.type}</div>

                                            {graduatePrograms.modality && (
                                                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Briefcase size={12} />{graduatePrograms.modality}</div>
                                            )}

                                            <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center capitalize"><MapPinIcon size={12} />{graduatePrograms.city}/{graduatePrograms.state}</div>
                                            {graduatePrograms.rating && (
                                                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Star size={12} />CONCEITO CAPES: {graduatePrograms.rating}</div>
                                            )}

                                            {graduatePrograms.start && (
                                                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center">
                                                    <Calendar size={12} />
                                                    ANO DE INÍCIO: {new Date(graduatePrograms.start).getFullYear()}
                                                </div>
                                            )}



                                            {graduatePrograms.area && (
                                                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Blocks size={12} />{graduatePrograms.area}</div>
                                            )}

                                            {graduatePrograms.basic_area && (
                                                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Blocks size={12} />{graduatePrograms.basic_area}</div>
                                            )}

                                        </div>
                                    </p>



                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="px-8 md:px-8">
                                <div className="relative grid grid-cols-1 xl:hidden">
                                    <ScrollArea className="relative w-full overflow-x-auto">
                                        <div className="flex w-full gap-2">
                                            <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent border pt-2 px-2 dark:bg-neutral-800 w-full">
                                                {tabs.map(({ id, label, icon: Icon }) => (
                                                    <div
                                                        key={id}
                                                        className={`pb-2 border-b-2 text-black dark:text-white transition-all ${value === id ? "border-b-[#719CB8]" : "border-b-transparent"
                                                            }`}
                                                        onClick={() => setValue(id)}
                                                    >
                                                        <Button variant="ghost" className="m-0">
                                                            <Icon size={16} />
                                                            {label}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </TabsList>
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <TabsContent value="docentes" className="m-0">
                            <DocentesGraduate graduate_program_id={graduatePrograms.graduate_program_id} />
                        </TabsContent>

                        <TabsContent value="discentes" className="m-0">
                            <DiscentesGraduate graduate_program_id={graduatePrograms.graduate_program_id} />
                        </TabsContent>
                    </div>
                </Tabs>
            </main>

        </>
    )
}