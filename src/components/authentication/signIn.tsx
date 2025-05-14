import { useContext, useEffect, useState } from "react";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {

    CardContent,
    CardDescription,

    CardHeader,
    CardTitle,
} from "../ui/card"
import { Button } from "../ui/button";
import { signInWithEmailAndPassword } from 'firebase/auth';
import "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import img1 from '../../assets/bg_home.png';

import { toast } from "sonner"

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { UserContext } from "../../context/context";


import { GoogleLogo, SignIn } from "phosphor-react";

import { LogoConecteeWhite } from "../svg/LogoConecteeWhite";
import { MUfmg } from "../svg/MUfmg";
import { useTheme } from "next-themes";
import { LogoIaposWhite } from "../svg/LogoIaposWhite";
import { LogoConectee } from "../svg/LogoConectee";
import { LogoIapos } from "../svg/LogoIapos";

export function SignInContent() {


    //firebase
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setLoggedIn, urlGeralAdm, version } = useContext(UserContext);
    const history = useNavigate();
    const { setUser } = useContext(UserContext);
    const { theme, setTheme } = useTheme()

    const handleLogin = async () => {
        try {
            if (email.length == 0) {
                toast("Erro ao fazer login", {
                    description: "Preencha o email",
                    action: {
                        label: "Fechar",
                        onClick: () => console.log("Undo"),
                    },
                })

                return
            }

            if (password.length == 0) {
                toast("Erro ao fazer login", {
                    description: "Preencha a senha",
                    action: {
                        label: "Fechar",
                        onClick: () => console.log("Undo"),
                    },
                })

                return
            }

            if (password.length <= 7) {
                toast("Erro ao fazer login", {
                    description: "Senha incorreta",
                    action: {
                        label: "Fechar",
                        onClick: () => console.log("Undo"),
                    },
                })

                return
            }

            else if (email.length != 0 && password.length != 0 && password.length >= 8) {
                const result = await signInWithEmailAndPassword(auth, email, password);

                try {
                    const data = [
                        {
                            displayName: result.user.displayName,
                            email: result.user.email,
                            uid: result.user.uid,
                            photoURL: result.user.photoURL,
                            provider: result.user.providerId
                        }
                    ]

                    const urlProgram = urlGeralAdm + 's/user'
                    const urlUser = urlGeralAdm + `s/user?uid=${result.user.uid}`

                    const fetchData = async () => {

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
                                const fetchDataLogin = async () => {
                                    try {
                                        const response = await fetch(urlUser, {
                                            mode: "cors",
                                            method: 'GET',
                                            headers: {
                                                "Access-Control-Allow-Origin": "*",
                                                "Access-Control-Allow-Methods": "GET",
                                                "Access-Control-Allow-Headers": "Content-Type",
                                                "Access-Control-Max-Age": "3600",
                                                "Content-Type": "text/plain",
                                            },
                                        });
                                        const data = await response.json();
                                        if (data && Array.isArray(data) && data.length > 0) {
                                            data[0].roles = data[0].roles || [];
                                            setLoggedIn(true)
                                            setUser(data[0]);

                                            history('/');
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                };
                                fetchDataLogin();
                            } else {
                                const fetchDataLogin = async () => {
                                    try {
                                        const response = await fetch(urlUser, {
                                            mode: "cors",
                                            method: 'GET',
                                            headers: {
                                                "Access-Control-Allow-Origin": "*",
                                                "Access-Control-Allow-Methods": "GET",
                                                "Access-Control-Allow-Headers": "Content-Type",
                                                "Access-Control-Max-Age": "3600",
                                                "Content-Type": "text/plain",
                                            },
                                        });
                                        const data = await response.json();
                                        if (data && Array.isArray(data) && data.length > 0) {
                                            data[0].roles = data[0].roles || [];
                                            setLoggedIn(true)
                                            setUser(data[0]);

                                            history('/');
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                };
                                fetchDataLogin();
                            }

                        } catch (err) {
                            console.log(err);
                        }

                    };

                    fetchData();

                } catch (error) {
                    toast("Erro ao processar requisição", {
                        description: "Tente novamente",
                        action: {
                            label: "Fechar",
                            onClick: () => console.log("Undo"),
                        },
                    })
                }

            }
        } catch (error) {
            console.error('Authentication error:', error);
            toast("Erro ao fazer login", {
                description: "Revise os dados e tente novamente",
                action: {
                    label: "Fechar",
                    onClick: () => console.log("Undo"),
                },
            })
        }
    };

    function handleGoogleSignIn() {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then(async (result) => {

                try {
                    const data = [
                        {
                            displayName: result.user.displayName,
                            email: result.user.email,
                            uid: result.user.uid,
                            photoURL: result.user.photoURL,
                            provider: 'google'
                        }
                    ]

                    let urlProgram = urlGeralAdm + 's/user'
                    let urlUser = urlGeralAdm + `s/user?uid=${result.user.uid}`

                    const fetchData = async () => {

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
                                const fetchDataLogin = async () => {
                                    try {
                                        const response = await fetch(urlUser, {
                                            mode: "cors",
                                            method: 'GET',
                                            headers: {
                                                "Access-Control-Allow-Origin": "*",
                                                "Access-Control-Allow-Methods": "GET",
                                                "Access-Control-Allow-Headers": "Content-Type",
                                                "Access-Control-Max-Age": "3600",
                                                "Content-Type": "text/plain",
                                            },
                                        });
                                        const data = await response.json();
                                        if (data && Array.isArray(data) && data.length > 0) {
                                            data[0].roles = data[0].roles || [];
                                            setLoggedIn(true)
                                            setUser(data[0]);



                                            history('/');
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                };
                                fetchDataLogin();




                            } else {
                                const fetchDataLogin = async () => {
                                    try {
                                        const response = await fetch(urlUser, {
                                            mode: "cors",
                                            method: 'GET',
                                            headers: {
                                                "Access-Control-Allow-Origin": "*",
                                                "Access-Control-Allow-Methods": "GET",
                                                "Access-Control-Allow-Headers": "Content-Type",
                                                "Access-Control-Max-Age": "3600",
                                                "Content-Type": "text/plain",
                                            },
                                        });
                                        const data = await response.json();
                                        if (data && Array.isArray(data) && data.length > 0) {
                                            data[0].roles = data[0].roles || [];
                                            setLoggedIn(true)
                                            setUser(data[0]);



                                            history('/');
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                };
                                fetchDataLogin();
                            }

                        } catch (err) {
                            console.log(err);
                        }

                    };

                    fetchData();

                } catch (error) {
                    toast("Erro ao processar requisição", {
                        description: "Tente novamente",
                        action: {
                            label: "Fechar",
                            onClick: () => console.log("Undo"),
                        },
                    })
                }

            })
            .catch((error) => {
                console.log(error)
                toast("Erro ao fazer login", {
                    description: "Revise os dados e tente novamente",
                    action: {
                        label: "Fechar",
                        onClick: () => console.log("Undo"),
                    },
                })
            })
    };

    // Estado para a frase e autor atuais
    const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });

    const navigate = useNavigate();

    function handleClick(): void {
        navigate("/")
    }

    return (
        <div className="w-full h-screen flex">

            <div
                className="
                    w-1/2 md:hidden h-full p-16
                    lg:flex flex-col justify-start bg-zinc-500
                    
                "
                
            >
                <a href="/">
                    <img
                        src="/logo_cimatec.png"
                        alt="Logo cimatec"
                        className="
                            mt-8 w-[500px]
                        "
                    />
                </a>
            </div>

            <div className="px-8 md:w-full lg:w-1/2 w-full h-full flex md:px-16 items-center justify-center flex-col">
                <div className="max-w-[400px] w-full">
                    <div className="flex gap-3 flex-col">
                        <div>

                        <h3
                            className="
                                text-6xl font-bold mb-5
                                dark:text-white text-center
                            "
                        >
                            Fazer Login
                        </h3>

                        </div>
                        <Button className=" w-full" variant={'outline'} onClick={handleGoogleSignIn} ><GoogleLogo size={16} className="" /> Login com Google</Button>

                    </div>

                    <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-800 my-6">
                        <div className="w-full h-[0.5px] bg-neutral-400 dark:bg-neutral-800"></div>
                        ou
                        <div className="w-full h-[0.5px]  bg-neutral-500 dark:bg-neutral-800"></div>
                    </div>

                    <CardContent className=" p-0 w-full flex flex-col gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="name">Email</Label>
                            <Input onChange={(e) => setEmail(e.target.value)} id="name" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="current">Senha</Label>
                            <Input onChange={(e) => setPassword(e.target.value)} id="current" type="password" />
                        </div>

                        <Button onClick={handleLogin} className="text-white w-full dark:text-white"><SignIn size={16} /> Fazer login</Button>

                        <Link to={'/recoverPassword'}>   <Button variant={'link'} className="px-0 ml-auto float-left relative">Esqueci a senha</Button></Link>
                    </CardContent>
                </div>

            </div>
        </div>
    )
}