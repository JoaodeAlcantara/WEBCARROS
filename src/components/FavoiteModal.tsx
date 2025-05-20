import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useFavorite } from "../contexts/FavoriteContext";
import api from "../services/api";
import { toast } from "react-toastify";
import { useCar } from "../contexts/CarContext";
import { FavoriteItem } from "../types";
import { IoCarSportSharp } from "react-icons/io5";
// import { Car } from "../types";


interface GroupType {
    image: string | undefined,
    name: string
}

interface FavProps {
    setFetch?: React.Dispatch<boolean>;
}

function FavoriteModal({ setFetch }: FavProps) {

    const [newGroup, setNewGroup] = useState(false);
    const { dispatch, carId } = useFavorite();
    const { dispatch: carDispatch } = useCar();
    const [group, setGroup] = useState<GroupType[]>();
    const [input, setInput] = useState('');
    const [msgErro, setmsgErro] = useState('');
    // const [car, setCar] = useState<Car>();

    async function handleAddfavorite(groupName: string | undefined) {
        try {
            const group = groupName !== undefined ? groupName : input

            if (newGroup) {
                if (!group) {
                    setmsgErro('Adicione um nome ao grupo para salvar');
                    return;
                }
            }

            await api.post(`/add-favorite-car/id/${carId}`, { group: group || '' }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            toast.success('Carro adiciondo as favoritos', {
                containerId: 'fav',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
            if (setFetch) setFetch(true);

            setInput('')
            carDispatch({ type: 'setFetch', payload: true });
            dispatch({ type: 'setShowModal', payload: false });

        } catch (err) {
            console.log(err);
        }
    }

    async function handleGetGroup() {
        try {
            const req = await api.get('list-favorite-car/my', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const favorites = req.data.favorites;
            const gp = favorites.reduce((acc: GroupType[], item: FavoriteItem) => {
                const nomeGrupo = item.group || 'todos';
                if (!acc.some(g => g.name === nomeGrupo)) {
                    acc.push({
                        name: nomeGrupo,
                        image: item.car?.carImages[0]?.filename
                    });
                }
                return acc;
            }, []);

            setGroup(gp)
        } catch (err) {
            console.log(err);
        }
    }

    async function getByCarId() {
        try {
            if (!carId) return;

            const req = await api.get(`/list-car/id/${carId}`);

            if (req.data.status === 404) {
                console.log('não existe')
            }

            // setCar(req.data.car);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetGroup()
        getByCarId()
    }, []);

    return (
        <>
            <div className="bg-white/30 fixed z-40 top-0 left-0 w-full h-screen cursor-pointer"
                onClick={() => dispatch({ type: 'setShowModal', payload: false })}
            ></div>

            <section className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-lg shadow-2xl w-full max-w-[400px]">
                {/* <div className="mb-2 bg-zinc-900 rounded-lg py-4 px-6">
                    <div className="flex gap-2 cursor-default">
                        <img src={`http://localhost:3000/files/${car?.carImages[0].filename}`} alt="imagem do carro" className="w-30 object-cover rounded-lg" />
                        <div className="flex flex-col items-start justify-center text-gray-300">
                            <p className="text-lg font-semibold">{car?.name}</p>
                            <p>{car?.model}</p>
                        </div>
                    </div>
                </div> */}
                <div className="flex items-center gap-4 bg-zinc-900 px-6 py-4 rounded-t-lg cursor-pointer hover:bg-zinc-950 duration-200 border-b-2 border-white"
                    onClick={() => handleAddfavorite(undefined)}
                >
                    {group && group.length ?
                        <>
                            <img src={`http://localhost:3000/files/${group[0].image}`} alt="imagem do carro" className="w-30 h-auto rounded-lg" />
                            <div className="flex items-center justify-between w-full gap-4">
                                <div>
                                    <p className="text-xl text-white font-semibold">Favoritos</p>
                                    <p className="text-gray-300">Adicionar aos favoritos</p>
                                </div>
                                <button className="cursor-pointer"><FaPlusCircle size={20} className="text-white" /></button>
                            </div>
                        </>

                        :
                        <>
                            <div className="w-30 h-20 rounded-lg">
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <IoCarSportSharp size={20} className="text-gray-300" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full gap-4">
                                <div>
                                    <p className="text-xl text-white font-semibold">Favoritos</p>
                                    <p className="text-gray-300">Adicionar aos favoritos</p>
                                </div>
                                <button className="cursor-pointer"><FaPlusCircle size={20} className="text-white" /></button>
                            </div>
                        </>
                    }
                </div>

                {newGroup ?
                    <div className="bg-zinc-900 flex flex-col items-center justify-center px-6 py-4 rounded-b-lg">
                        <form className="w-full">
                            <input
                                type="text"
                                className="bg-zinc-700 rounded-lg w-full h-10 border-zinc-800 border-2 text-white px-2 outline-none" placeholder="Nome do grupo..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            {msgErro && (<span className="text-red-600">* {msgErro}</span>)}

                            <div className="flex w-full justify-end gap-3 mt-5">
                                <button type="button" onClick={() => {
                                    setNewGroup(!newGroup);
                                    setmsgErro('');
                                }}
                                    className="cursor-pointer bg-zinc-700 border-0 text-white px-3 py-1 rounded-lg hover:bg-zinc-800 duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" onClick={(e) => {
                                    e.preventDefault();
                                    handleAddfavorite(undefined);
                                }}
                                    className="cursor-pointer bg-zinc-700 border-0 text-white px-3 py-1 rounded-lg hover:bg-zinc-800 duration-200">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="bg-zinc-900 rounded-b-lg p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-300 text-xl font-semibold cursor-default">Grupos</p>
                            <button onClick={() => setNewGroup(!newGroup)}
                                className="text-white cursor-pointer hover:bg-zinc-950 py-1 px-2 rounded-lg text-xl font-semibold">
                                Novo Grupo +
                            </button>
                        </div>

                        <div className="overflow-auto scrollbar h-full max-h-[250px] px-2">

                            {
                                group && group.length ?
                                    group.filter(item => item.name !== 'todos')
                                        .map(item => (
                                            <div onClick={() => {
                                                handleAddfavorite(item.name);
                                            }}
                                                key={item.name}
                                                className="cursor-pointer mt-5 flex items-center justify- gap-4 hover:bg-zinc-950 p-2 rounded-lg duration-200">
                                                <img src={`http://localhost:3000/files/${item.image}`} alt="imagem do carro" className="w-30 h-auto rounded-lg" />
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-white text-xl font-semibold">{item.name}</p>
                                                        <p className="text-gray-300">Adicionar a este grupo</p>
                                                    </div>
                                                    <button className="cursor-pointer"><FaPlusCircle size={20} className="text-gray-300" /></button>
                                                </div>
                                            </div>
                                        ))
                                    :
                                    <p></p>
                            }
                        </div>
                    </div>
                }
            </section>
        </>
    )
}

export default FavoriteModal