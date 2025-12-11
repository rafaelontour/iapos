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

export interface OrcidUser {
  user: {
    email: string;
    nome: string;
    sobrenome: string;
    data_nascimento: string;
  };
  orcid_id: string;
}

export function OrcidLoginCallback() {
  const { urlGeral, urlGeralAdm, setLoggedIn, version } = useContext(UserContext);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<OrcidUser | null>(null);
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
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    const fetchAndRegister = async () => {
      try {
        const response = await fetch(`${urlGeralAdm}auth/orcid/callback?code=${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados da ORCID");

        const data: OrcidUser = await response.json();
        if (data) {
          setUserData(data);

          const email = data.user.email;
          const password = data.user.data_nascimento;

          const firebaseUser = await loginOrCreate(email, password);

          const payload = [
            {
              displayName: data.user.nome,
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              photoURL: firebaseUser.photoURL,
              provider: "orcid",
              birth_date: data.user.data_nascimento,
              registration: data.orcid_id,
              last_name: data.user.sobrenome,
              first_name: data.user.nome,
            },
          ];

          const postUserResponse = await fetch(`${urlGeralAdm}s/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!postUserResponse.ok) throw new Error("Erro ao salvar usuário no sistema");

          window.location.replace("/");
        }
      } catch (error) {
        console.error("Erro na integração ORCID:", error);
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
        <p className="text-9xl text-[#719CB8] font-bold mb-16 animate-pulse">{`O_O`}</p>
        <h1 className="text-2xl text-neutral-400 font-medium leading-tight text-center px-8 tracking-tighter lg:leading-[1.1]">
          Carregando autenticação ORCID...
        </h1>
        <h1 className="text-2xl text-neutral-400 font-medium leading-tight text-center px-8 tracking-tighter lg:leading-[1.1]">
          {userData?.user.email}
        </h1>
      </div>
    </div>
  );
}
