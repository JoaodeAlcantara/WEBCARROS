import { Car } from "../types";
import { MdLocationPin } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState } from "react";
import CarMenu from "./CarMenu";


function ItemCar({ item }: { item: Car }) {

    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);


    return (
        <>
            <Link to={`/car/${item.slug}`}>
                <section className='w-full bg-white rounded-lg flex flex-col group shadow hover:shadow-2xl duration-200 cursor-pointer relative'>
                    {item.status ===  'oculto' && (
                        <div className="bg-gray-300/50 absolute z-10 w-full h-full rounded-lg flex items-center justify-center">
                            <p className="bg-gray-600 px-2 py-1 rounded-full text-white font-semibold">{item.status.toLocaleUpperCase()}</p>
                        </div>
                    )}
                    <div className="relative">
                        <img src={`http://localhost:3000/files/${item.carImages[0].filename}`} alt="imagem do carro" className="w-full h-50 rounded-t-lg object-cover"/>

                        <span className="absolute bottom-4 left-2 bg-white/70 rounded-md px-1 hidden items-center gap-4 text-gray-600 group-hover:flex duration-150">
                            <FaEye /> {item.views}
                        </span>
                        {location.pathname === '/dashboard' &&
                            <span className="p-1 rounded-full bg-white flex items-center absolute right-2 top-2 hover:scale-105 duration-200 z-20">
                                <HiDotsVertical size={23} onClick={(e) => {
                                    e.preventDefault();
                                    setShowMenu(!showMenu);
                                }}/>
                            </span>
                        }
                    </div>

                    <CarMenu showMenu={showMenu} id={item.id}/>

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

                            <button className="cursor-pointer">
                                <MdFavoriteBorder size={20} />
                            </button>

                        </div>
                    </div>
                </section>
            </Link>
        </>
    )
}

export default ItemCar