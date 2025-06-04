import { useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../../ui/carousel";
import { Alert } from "../../ui/alert";
import { CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/context";

interface Banner {
  id: string;
  titulo: string;
  imgURL: string;
  descricao?: string;
  botao?: string;
  link?: string;
  color: string;
  textColor: string;
}

export function BannerHome() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const { version } = useContext(UserContext);

  useEffect(() => {
    const fetchBanners = async () => {
      const db = getFirestore();
      const bannersRef = collection(db, version ? "background" : "background_iapos");
      const snapshot = await getDocs(bannersRef);
      const bannersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Banner[];

      setBanners(bannersData);
    };

    fetchBanners();
  }, [version]);

  // Captura índice atual do carrossel
  useEffect(() => {
    if (!emblaApi) return;

    const updateIndex = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", updateIndex);
    updateIndex(); // inicializa no load

    return () => {
      emblaApi.off("select", updateIndex);
    };
  }, [emblaApi]);

  return (
    <div className="flex w-full relative">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        setApi={setEmblaApi}
        className="w-full flex items-center"
      >
        <CarouselContent>
          {banners.length > 0 ? (
            banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div>
                  <Alert
                    style={{ backgroundColor: banner.color }}
                    className="p-0 rounded-md grid lg:grid-cols-2"
                  >
                    <CardContent className="flex h-[300px] items-center p-16 bg-cover bg-center lg:rounded-l-md">
                      <div className="flex z-[2] flex-col gap-3">
                        <h1 style={{ color: banner.textColor }} className="text-2xl font-medium">
                          {banner.titulo}
                        </h1>
                        {banner.descricao && (
                          <p style={{ color: banner.textColor }}>{banner.descricao}</p>
                        )}
                        {banner.link && (
                          <Link to={banner.link} target="_blank" className="w-fit">
                            <Button
                              style={{
                                color: banner.textColor,
                                border: `1px solid ${banner.textColor}`,
                              }}
                              className="bg-transparent hover:bg-transparent"
                              variant="outline"
                            >
                              <Link2 size={16} /> {banner.botao}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>

                    <div
                      className="h-[300px] bg-cover bg-center rounded-b-md lg:rounded-r-md"
                      style={{ backgroundImage: `url(${banner.imgURL})` }}
                    />
                  </Alert>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="p-1">
                <Alert>
                  <CardContent className="flex h-[300px] items-center justify-center p-6">
                    <span className="text-4xl font-semibold">Carregando...</span>
                  </CardContent>
                </Alert>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        <div className="w-full absolute bottom-0 right-0 flex justify-end p-6 gap-3 items-center">
          <CarouselPrevious className="rounded-md" />
          <p className="font-medium text-sm text-white">
            {currentIndex + 1} / {banners.length}
          </p>
          <CarouselNext className="rounded-md" />
        </div>
      </Carousel>
    </div>
  );
}
