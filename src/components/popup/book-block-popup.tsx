import { useState } from "react";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Button } from "../ui/button";
import { Plus } from "phosphor-react";

import { BookItem } from "./Livro";

type Articles = {
    articles: any[];
    distinct: boolean
    type: string
}

export function BookBlockPopUp(propsGeral: Articles) {
    const [count, setCount] = useState(12)
    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{
                    350: 1,
                    750: 1,
                    900: 2,
                    1200: 2,
                    1700: 3
                }}
            >
                <Masonry gutter="16px">
                    {propsGeral.articles.slice(0, count).map((props: any) => {

                        return (
                            <BookItem
                            type={propsGeral.type}
                            {...props}
                            />

                        );
                    })}
                </Masonry>
            </ResponsiveMasonry>

            {propsGeral.articles.length > count && (
                <div className="w-full flex justify-center mt-8"><Button onClick={() => setCount(count + 12)}><Plus size={16} />Mostrar mais</Button></div>
            )}

        </div>
    )
}