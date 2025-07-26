import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from 'next-themes';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { UserContext } from '../context/context';


interface LoadingWrapperProps {
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { setLoggedIn, setUser, urlGeralAdm, setPermission, setRole, version } = useContext(UserContext);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser || !firebaseUser.uid) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const urlUser = `${urlGeralAdm}s/user?uid=${firebaseUser.uid}`;
        console.log(urlUser);


        const fetchData = async () => {
          try {
            const response = await fetch(urlUser, {
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
            if (data && Array.isArray(data) && data.length > 0) {
              setLoggedIn(true)
              data[0].roles = data[0].roles || [];
              setUser(data[0]);

              const storedUser = localStorage.getItem('permission');
              const storedRole = localStorage.getItem('role');

              if (storedUser) {
                // Se as informações do usuário forem encontradas no armazenamento local, defina o usuário e marque como autenticado
                setPermission(JSON.parse(storedUser));

              }

              if (storedRole) {
                // Se as informações do usuário forem encontradas no armazenamento local, defina o usuário e marque como autenticado
                setRole(JSON.parse(storedRole));

              }

            }
          } catch (err) {
            console.log(err);
          }
        }

        fetchData()


      } catch (err) {
        console.error("Erro no login:", err);

        setLoggedIn(false);
      } finally {
        setLoading(false);

        setTimeout(() => {
          setLoading(false);
        }, 2000); // 2000 ms = 2 segundos
      }
    });

    return () => unsubscribe();
  }, []);

  return loading ? (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="h-20 animate-pulse">
        <img src="/iapos.png" />
      </div>
    </main>
  ) : (
    <>{children}</>
  );
};

export default LoadingWrapper;
