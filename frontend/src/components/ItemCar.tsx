import { Car, FavoriteItem } from "../types";
import { MdLocationPin } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState } from "react";
import CarMenu from "./CarMenu";
import { useFavorite } from "../contexts/FavoriteContext";
import { FaTrashAlt } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { useAuth } from "../contexts/authContext";
import { useCar } from "../contexts/CarContext";
import { toast } from "react-toastify";

interface ItemProps {
    item: Car,
    fav?: FavoriteItem[] | undefined;
}

function ItemCar({ item, fav }: ItemProps) {

    const { auth, signed } = useAuth();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const { dispatch, deleteFavoriteItem } = useFavorite();
    const { dispatch: carDispatch } = useCar();
    const isFavorite = Array.isArray(fav) ? fav?.some(f => f.userId === auth?.id) : fav;

    function handleFavorite(id: number) {
        dispatch({ type: 'setShowModal', payload: true });
        dispatch({ type: 'setCarId', payload: id });
    }

    async function handleDelete(id: number) {

        const favorite = Array.isArray(fav) ? fav?.find(f => f.carId === id && f.userId === auth?.id) : fav;
        const isDelete = favorite ? await deleteFavoriteItem(favorite?.id) : false;

        if (isDelete) {
            toast.success('Carro removido dos favoritos', {
                containerId: 'fav',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            })

            carDispatch({ type: 'setFetch', payload: true });
            dispatch({ type: 'setFetch', payload: true });
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
    return (
        <>
            <Link to={`/car/${item.slug}`}>
                <section className='w-full bg-white rounded-lg flex flex-col group shadow hover:shadow-2xl duration-200 cursor-pointer relative'>
                    {item.status === 'oculto' && (
                        <div className="bg-gray-300/50 absolute z-10 w-full h-full rounded-lg flex items-center justify-center">
                            <p className="bg-gray-600 px-2 py-1 rounded-full text-white font-semibold">{item.status.toLocaleUpperCase()}</p>
                        </div>
                    )}
                    <div className="relative">
                        {location.pathname === '/dashboard/favorites' ?
                            <img src={`http://localhost:3000/files/${item.images}`} alt="imagem do carro" className="w-full h-50 rounded-t-lg object-cover" />
                            : 
                            <img src={`http://localhost:3000/files/${item.carImages[0].filename}`} alt="imagem do carro" className="w-full h-50 rounded-t-lg object-cover" />
                        }


                        <span className="absolute bottom-4 left-2 bg-white/70 rounded-md px-1 hidden items-center gap-4 text-gray-600 group-hover:flex duration-150">
                            <FaEye /> {item.views}
                        </span>
                        {location.pathname === '/dashboard' &&
                            <button onClick={(e) => {
                                e.preventDefault();
                                setShowMenu(!showMenu);
                            }}
                                className="p-1 rounded-full bg-white flex items-center absolute right-2 top-2 hover:scale-105 duration-200 z-20">
                                <HiDotsVertical size={23} />
                            </button>
                        }
                        {location.pathname === '/dashboard/favorites' &&
                            <button className="p-1.5 rounded-full bg-white flex items-center justify-center absolute right-2 top-2 hover:text-red-600 duration-200 z-20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(item.id);
                                }}
                            >
                                <FaTrashAlt size={20} className="cursor-pointer" />
                            </button>
                        }
                    </div>

                    <CarMenu showMenu={showMenu} id={item.id} />

                    <p className="font-semibold mt-1 mg-2 px-2 text-lg">{item.name}</p>
                    <p className="font-semibold text-gray-600 mg-2 px-2 text-lg">{item.model}</p>

                    <div className="flex mt-1 px-2 items-center text-gray-600 font-semibold">
                        <p>{item.year} | {item.kilometersRun} km</p>
                    </div>

                    <div className="mt-auto">
                        <p className="font-bold text-xl px-2 my-4">
                            {Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>

                    <div className="px-2 py-2 mt-auto w-full border-t-1 border-gray-400">
                        <div className="text-gray-600 px-2 flex items-center justify-between font-semibold">
                            <p className="flex items-center gap-2">
                                <MdLocationPin size={20} />
                                {item.city}
                            </p>

                            {!(location.pathname == '/dashboard/favorites') && (
                                <button onClick={(e) => {
                                    e.preventDefault();

                                    if (signed) {
                                        if (isFavorite) {
                                            handleDelete(item.id)
                                        } else {
                                            handleFavorite(item.id)
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
                                }
                                }
                                    className="cursor-pointer">
                                    {isFavorite ?
                                        <MdFavorite size={20} />
                                        :
                                        <MdFavoriteBorder size={20} />
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </Link>
        </>
    )
}

export default ItemCar