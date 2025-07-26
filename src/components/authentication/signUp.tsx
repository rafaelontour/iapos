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
import { toast } from "sonner"

import "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";




import { UserContext } from "../../context/context";
import { GoogleLogo } from "phosphor-react";
import { UserPlus } from "lucide-react";


export function SignUpContent() {



  //firebase
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const { setLoggedIn, version } = useContext(UserContext);
  const history = useNavigate();
  const { setUser, urlGeralAdm } = useContext(UserContext);


  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignOut = async (e: any) => {
    try {

      if (name.length == 0) {
        toast("Revise os dados", {
          description: "Preencha o nome completo",
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })

        return
      }

      if (email.length == 0) {
        toast("Revise os dados", {
          description: "Preencha o email",
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })

        return
      }

      if (password.length == 0) {
        toast("Revise os dados", {
          description: "Preencha a senha",
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })

        return
      }

      if (password.length <= 7) {
        toast("Revise os dados", {
          description: "A senha precisa ter 8 ou mais caractéries",
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })

        return
      }

      if (password != confPassword) {
        toast("Revise os dados", {
          description: "As senhas não conferem",
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })

        return
      }

      if (password == confPassword && password.length >= 8 && email.length != 0 && name.length != 0) {
        e.preventDefault();
        createUserWithEmailAndPassword(email, password)
          .then(userCredential => {
            userCredential?.user && updateProfile(userCredential.user, { displayName: name });
          })



        history('/signIn');
      }

    } catch (error) {
      console.error('Authentication error:', error);
      toast("Erro ao criar conta", {
        description: "Revise os dados e tente novamente",
        action: {
          label: "Fechar",
          onClick: () => console.log("Undo"),
        },
      })
    }

  }


  //google

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
  }

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full p-16 md:flex justify-between flex-col hidden bg-cover bg-center bg-no-repeat bg-zinc-500" >

        <a href="/">
          <img
            src="logo_cimatec.png"
            alt="Logo cimatec"
            className="
                          mt-8 w-[500px]
                      "
          />
        </a>

      </div>
      <div className="md:w-1/2 w-full h-full flex md:px-16 items-center justify-center flex-col">


        <div className="max-w-[400px] w-full">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-5xl text-center">Criar conta</CardTitle>
          </CardHeader>

          <div className="flex gap-3 flex-col">

            <Button className=" w-full" variant={'outline'} onClick={handleGoogleSignIn} ><GoogleLogo size={16} className="" /> Criar conta com Google</Button>

          </div>


          <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-800 my-6">
            <div className="w-full h-[0.5px] bg-neutral-400 dark:bg-neutral-800"></div>
            ou
            <div className="w-full h-[0.5px]  bg-neutral-500 dark:bg-neutral-800"></div>
          </div>

          <CardContent className=" p-0 w-full flex flex-col gap-3">
            <div className="space-y-1">
              <Label htmlFor="name">Nome completo</Label>
              <Input onChange={(e) => setName(e.target.value)} id="name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Email</Label>
              <Input onChange={(e) => setEmail(e.target.value)} id="username" />
            </div>

            <div className="flex gap-3 ">
              <div className="space-y-1">
                <Label htmlFor="current">Senha</Label>
                <Input onChange={(e) => setPassword(e.target.value)} id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Confirmar senha</Label>
                <Input onChange={(e) => setConfPassword(e.target.value)} id="new" type="password" />
              </div>
            </div>

            <Button onClick={handleSignOut} className="text-white dark:text-white w-full"><UserPlus size={16} />Criar conta</Button>
          </CardContent>
        </div>



      </div>
    </div>
  )
}