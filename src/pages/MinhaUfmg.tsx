import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../context/context";
import { auth } from "../lib/firebase";
import { useTheme } from "next-themes";
import { LogoConecteeWhite } from "../components/svg/LogoConecteeWhite";
import { LogoConectee } from "../components/svg/LogoConectee";
import { LogoIaposWhite } from "../components/svg/LogoIaposWhite";
import { LogoIapos } from "../components/svg/LogoIapos";

export interface User {
  user: UserProps;
  auth: AuthProps;
  institution: InstitutionProps;
  network: NetworkProps;
}

export interface UserProps {
  data_nascimento: string;
  email: string;
  nivel_curso: string;
  nome: string;
  registro: string;
  sexo: string;
  sobrenome: string;
  status_email: string;
  uid: string;
}

export interface AuthProps {
  auth_type: string | null;
  instant: string;
  metodo: string;
  provedor_id: string;
  remote_user: string | null;
  session_expires: string;
  session_id: string;
  session_inatividade: string;
}

export interface InstitutionProps {
  afiliacao: string;
  afiliacao_primaria: string;
  org_dn: string;
  org_unit_dn: string;
}

export interface NetworkProps {
  ip_forwarded: string;
  ip_real: string;
  user_agent: string;
}

export function MinhaUfmg() {
  const { urlGeral, urlGeralAdm, setLoggedIn, version } = useContext(UserContext);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();

  const loginOrCreate = async (email: string, password: string) => {
    try {
      const loginResult = await signInWithEmailAndPassword(auth, email, password);
      return loginResult.user;
    } catch (loginError: any) {
      if (loginError.code === "auth/user-not-found") {
        const createResult = await createUserWithEmailAndPassword(auth, email, password);
        return createResult.user;
      } else {
        throw loginError;
      }
    }
  };

  useEffect(() => {
    const url = `${urlGeralAdm}auth`;

    const fetchAndRegister = async () => {
      try {
        const response = await fetch(url, {
          mode: 'cors',
          method: 'GET',
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          }
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do MinhaUFMG");

        const data = await response.json();
        if (data) {
          setUserData(data);

          const email = data.user.email;
          const password = data.user.data_nascimento; // Ex: "01011990"
  
          const firebaseUser = await loginOrCreate(email, password);
  
          const payload = [
            {
              displayName: data.user.nome,
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              photoURL: firebaseUser.photoURL,
              provider: "minhaufmg",
              birth_date: data.user.data_nascimento,
              course_level: data.user.nivel_curso,
              registration: data.user.registro,
              email_status: data.user.status_email,
              last_name: data.user.sobrenome,
              gender: data.user.sexo,
              first_name: data.user.nome
            }
          ];
  
          const postUserResponse = await fetch(`${urlGeralAdm}s/user`, {
            method: "POST",
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '3600',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
  
          if (!postUserResponse.ok) throw new Error("Erro ao salvar usuário no sistema");
  
       
         
          window.location.replace("/");
        }
       

      } catch (error) {
        console.error("Erro na integração MinhaUFMG:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRegister();
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Link to={'/'} className='h-10 mb-24 absolute top-16 '>
        {version ? (
          theme === 'dark' ? <LogoConecteeWhite /> : <LogoConectee />
        ) : (
          theme === 'dark' ? <LogoIaposWhite /> : <LogoIapos />
        )}
      </Link>

      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-9xl text-[#719CB8] font-bold mb-16 animate-pulse">{`U_U`}</p>
        <h1 className="text-2xl text-neutral-400 font-medium leading-tight text-center px-8 tracking-tighter lg:leading-[1.1]">
          Carregando autenticação MinhaUFMG...
        </h1>
        <h1 className="text-2xl text-neutral-400 font-medium leading-tight text-center px-8 tracking-tighter lg:leading-[1.1]">
          {userData?.user.email}
        </h1>
      </div>
    </div>
  );
}
