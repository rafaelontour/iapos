import { string } from "prop-types";

interface CartaoOrientandoProps {
    tipo?: string;
    nome: string;
    previsao: string;
    status?: string;
}

export default function CartaoOrientando(props: CartaoOrientandoProps) {

    const tipo = () => {
        if (props.tipo === 'entrada') {
            return 'Previsão de defesa do projeto:'
        }

        if (props.tipo === 'defendido') {
            return 'Previsão de qualificação:'
        }

        if (props.tipo === 'qualificado') {
            return 'Previsão de defesa final:'
        }
    }

    const corSpanPrevisao = () => {
        if (props.status === 'Aprovado') {
            return 'green-500'
        } else if (props.status === 'atraso') {
            return 'red-500'
        } else {
            return 'yellow-500'
        }
    }

    return (
        <div className="flex items-center gap-5 border rounded-md shadow-md p-5 max-h-[180px]">
            <div className="flex items-center w-[100px] h-[100px] bg-[url(https://picsum.photos/seed/picsum/150/150)] bg-cover">

            </div>

            <div className="flex flex-col gap-3 h-[150px]">
                <p className="font-bold text-lg mt-3">{props.nome}</p>
                <p>{tipo()} {props.previsao}</p>

                {
                    props.status && (
                        <p>Status: <span className={`bg-${corSpanPrevisao()} text-white px-2 py-1 rounded-md shadow-sm`}>{props.status}</span></p>
                    )
                }

            </div>
        </div>
    )
}