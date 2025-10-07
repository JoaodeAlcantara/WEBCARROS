import { useEffect, useState } from "react";
import Container from "../components/Container";;
import { FaWhatsapp } from 'react-icons/fa';
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { useParams } from "react-router-dom";
import { Car } from "../types";
import api from "../services/api";
import SldierImage from "../components/SliderImage";
import Loader from "../components/Loader";
import FavoriteModal from "../components/FavoiteModal";
import { useFavorite } from "../contexts/FavoriteContext";
import { useAuth } from "../contexts/authContext";
import { toast, ToastContainer } from "react-toastify";


function CarDetail() {

    const [car, setCar] = useState<Car>();
    const [loader, setLoader] = useState(true);
    const [fetch, setFetch] = useState(false);
    const { slug } = useParams();
    const { showModal, dispatch, deleteFavoriteItem } = useFavorite();
    const { auth, signed } = useAuth();
    const isFavorite = car?.favorites?.find(fav => fav.userId === auth?.id);


    async function getCar() {
        try {
            if (!slug) return;

            const req = await api.get(`/list-car/slug/${slug}`);

            if (req.data.status === 404) {
                console.log('não existe')
            }

            setCar(req.data.car);
            setLoader(false);

        } catch (err) {
            console.log(err);
            setLoader(false);
        }
    }

    useEffect(() => {
        getCar();
    }, []);

    useEffect(() => {
        if(fetch){
            getCar();
        }
        setFetch(false);
    }, [fetch]);

    function handleFavorite(id: number) {
        dispatch({ type: 'setShowModal', payload: true });
        dispatch({ type: 'setCarId', payload: id });
    }

    async function handleDelete(id: number) {

        const favorite = car?.favorites?.find(f => f.carId === id && f.userId === auth?.id);
        const isDelete = favorite ? await deleteFavoriteItem(favorite?.id) : false;

        if (isDelete) {
            toast.success('Carro removido dos favoritos', {
                containerId: 'fav',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            })

            dispatch({ type: 'setFetch', payload: true });
            setFetch(true);
        } else {
            toast.error('Erro ao remover o carro', {
                containerId: 'fav',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            })
        }
    }

    if (loader) {
        return <Loader />
    }

    return (
        <>
            {showModal && <FavoriteModal setFetch={setFetch} />}

            <Container>
                {car && <SldierImage car={car} />}

                {!car ?
                    <h1 className="text-center font-semibold text-xl mt-10">
                        Carro não encontrado ou inexistente!
                    </h1>
                    : (
                        <main className="w-full bg-white rounded-lg p-6 my-4">
                            <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                                <h1 className="font-bold text-black text-3xl">{car.name}</h1>
                                <h1 className="font-bold text-black text-3xl"> {Number(car.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </h1>
                            </div>

                            <div className="flex items-center justify-between w-full">
                                <p className="text-gray-600 font-semibold text-xl">{car.model}</p>

                                <div>
                                    <button className="cursor-pointer" title="favoritar"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (signed) {
                                                if (isFavorite) {
                                                    handleDelete(car.id);
                                                } else {
                                                    handleFavorite(car.id);
                                                }
                                            } else {
                                                toast.error('Faça login para favoritar um item', {
                                                    containerId: 'fav',
                                                    position: "top-center",
                                                    autoClose: 4000,
                                                    pauseOnHover: false,
                                                    theme: 'dark'
                                                })
                                            }
                                        }}
                                    >
                                        {isFavorite ?
                                            <MdFavorite size={25} />
                                            :
                                            <MdFavoriteBorder size={25} />
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="grid w-full max-w-xl my-10 gap-6 grid-cols-2 sm:grid-cols-3">
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">Cidade</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.city}</span>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">Ano</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.year}</span>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">KM</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.kilometersRun}</span>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">Câmbio</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.transmission}</span>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">Combustível</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.fuel}</span>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">Carroceria</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.category}</span>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-md sm:text-lg">Telefone</p>
                                    <span className="font-bold text-lg sm:text-xl">{car.contactPhone}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-600 text-md sm:text-lg">Descrição</p>
                                <p className="w-full max-w-2xl text-justify">{car.description}</p>
                            </div>

                            <a href={`https://api.whatsapp.com/send?phone=${car.contactPhone}&text=Olá, vi esse ${car.name.toUpperCase()} no site WebCarros e fiquei interessado`} target="_blank" className="bg-green-500 w-full text-white font-semibold flex items-center justify-center gap-2 my-6 h-15 sm:h-11 text-xl rounded-lg cursor-pointer hover:bg-green-600 duration-200 p-2">
                                Conversar com o vendedor <FaWhatsapp size={25} />
                            </a>
                        </main>
                    )
                }
            </Container>

            <ToastContainer containerId={'fav'}/>
        </>
    )
}

export default CarDetail