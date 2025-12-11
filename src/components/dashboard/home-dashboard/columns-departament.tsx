
import { ColumnDef } from "@tanstack/react-table"
import { PosGraduationsProps } from "../pos-graduacao/pos-graduacao-view-dashboard";
import { Button } from "../../ui/button";
import { ArrowUpDown } from "lucide-react";
import { areasComCores } from "../../graduate-program/program-item";
import { Alert } from "../../ui/alert";
import { Departamentos } from "./departaments-user-dashboard";


export const columnsDepartament: ColumnDef<Departamentos>[] = [
  {
    accessorKey: "dep_sigla",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sigla
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
      accessorKey: "dep_nom",
      header: "Nome do departamento",
    },
    {
      accessorKey: "dep_email",
      header: "Email",
    },
    {
      accessorKey: "dep_site",
      header: "Site",
    },
    {
      accessorKey: "dep_tel",
      header: "Telefone",
    },

   
  ];