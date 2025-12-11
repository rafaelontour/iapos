import { Alert } from "../ui/alert";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserContext } from "../../context/context";
import { Code, Home } from "lucide-react";
import { useContext } from "react";
import { getVersion } from "../../gerVersion";
import bg_popup from "../../assets/bg_home.png";
import { Helmet } from "react-helmet";


export function ModelosDocumentos() {
    const { version } = useContext(UserContext);
    const platform = version ? "Conectee" : "Simcc";
    const version2 = getVersion();
    return (
        <main className="p-4 md:p-8 bg-neutral-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
        <Helmet>
          <title>Modelos documentos | {version ? ('Conectee'):('Simcc')}</title>
          <meta name="description" content={`Modelos documentos | ${version ? ('Conectee'):('Simcc')}`} />
          <meta name="robots" content="index, follow" />
        </Helmet>

      <div className="max-w-[936px] mx-auto space-y-8">
        {/* Header */}
        <Alert className="p-0">
          <div className="flex border-0 rounded-b-none justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6 rounded-md">
            <span className="text-base font-medium text-gray-600 dark:text-gray-300">
            Modelos documentos
            </span>
            <Link to="/">
              <Button variant="outline">
                <Home size={16} className="mr-2" />
                Página Inicial
              </Button>
            </Link>
          </div>

          {/* Banner Hero */}
          <div
            className="p-8 rounded-t-none md:p-12 bg-cover bg-center rounded-md"
            style={{ backgroundImage: `url(${bg_popup})` }}
          >
            <h1 className="text-4xl font-bold mb-2">
              Plataforma {platform}
            </h1>
            <p className="text-sm font-light">
              Versão da plataforma: {version2}
            </p>
          </div>
        </Alert>
        </div>
        </main>
    )
}