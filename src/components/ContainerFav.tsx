import { useState, useRef, useEffect } from "react";
import { FavoriteGroup } from "../types";
import ItemCar from "./ItemCar";
import { HiDotsVertical } from "react-icons/hi";
import api from "../services/api";
import { useFavorite } from "../contexts/FavoriteContext";
import { showToastConfirm } from "./ToastConfirm";

interface FavProps {
    gpName: string,
    cars: FavoriteGroup
}

interface EditName {
    gpName: string | null,
    value: string
}



function ContainerFav({ gpName, cars }: FavProps) {

    const { dispatch } = useFavorite();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [editName, setEditName] = useState<EditName>({ gpName: null, value: '' });
    const inputRef = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (editName.gpName && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editName.gpName]);


    async function handleEditGroupName() {
        if (editName.value && editName.value.trim() === '') return;

        try {
            await api.patch(`/update-group-name/name/${editName.gpName}`, { name: editName.value }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            dispatch({ type: 'setFetch', payload: true });
            setEditName({ gpName: null, value: '' });
        } catch (err) {
            console.log(err)
        }
    }

    async function handleDeleteGroup(gpName: string) {
        try {
            await api.patch(`/update-group-name/name/${gpName}`, { name: '' }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch({ type: 'setFetch', payload: true });
        } catch (err) {
            console.log(err)
        }
    }

    async function handledeleteGroupAndItems(gpName: string) {
        try {
            await api.delete(`/delete-group-items/name/${gpName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch({ type: 'setFetch', payload: true });
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div key={gpName} className="mb-10 mt-5 rounded-lg p-2 relative">
            <div className="w-full mb-2 border-b-2 border-gray-400 px-2 flex justify-between items-center">
                {!editName.gpName ?
                    <h2 className="text-xl font-bold">{gpName}</h2>
                    :
                    <form className="flex items-center">
                        <input type="text"
                            ref={inputRef}
                            className="w-full max-w-sm border-2
                                            bg-white p-1 border-gray-400 rounded-md px-1 outline-none focus:border-gray-600 mb-1"
                            value={editName.value}
                            onChange={(e) => setEditName({ ...editName, value: e.target.value })}
                        />
                        <button type="button" className="p-1 bg-red-600 rounded m-1 items-center text-white font-bold cursor-pointer hover:bg-red-700"
                            onClick={() => setEditName({ gpName: null, value: '' })}
                        >
                            cancelar
                        </button>
                        <button type="submit" className="p-1 bg-green-700 rounded items-center text-white font-bold cursor-pointer hover:bg-green-800" onClick={(e) => {
                            e.preventDefault();
                            handleEditGroupName()
                        }}>
                            salvar
                        </button>
                    </form>
                }

                {gpName != 'todos' &&
                (<button className="cursor-pointer hover:bg-gray-300 duration-150 p-1 rounded-full"
                    onClick={() => setShowMenu(true)}
                >
                    <HiDotsVertical size={22} />
                </button>)
                }
            </div>

            {showMenu && (
                <>
                    <div className="w-full h-screen z-10 fixed top-0" onClick={() => setShowMenu(false)}></div>
                    <div className="bg-white w-fit px-3 py-1 rounded-lg shadow-sm absolute right-10 top-2 flex flex-col gap-1 z-40">
                        <button className="cursor-pointer hover:bg-gray-300 w-full duration-150 rounded-md text-start p-1"
                            onClick={() => {
                                setShowMenu(false);
                                setEditName({ gpName: gpName, value: gpName })
                            }}
                        >
                            Alterar nome
                        </button>
                        <button className="cursor-pointer hover:bg-gray-300 w-full duration-150 rounded-md text-start p-1"
                            onClick={() => {
                                showToastConfirm({
                                    message: 'Deseja deletar esse grupo? Os carros continuaram salvos',
                                    onConfirm: () => handleDeleteGroup(gpName),
                                    onCancel: () => { }
                                })
                            }}
                        >
                            Delete grupo
                        </button>
                        <button className="cursor-pointer hover:bg-gray-300 p-1 w-full duration-150 rounded-md text-start"
                            onClick={() => showToastConfirm({
                                message: 'Deseja deletar o grupo e seus respectivos carros?',
                                onConfirm: () => handledeleteGroupAndItems(gpName),
                                onCancel: () => { }
                            })}
                        >
                            Deletar grupo e itens
                        </button>
                    </div>
                </>
            )
            }

            {Array.isArray(cars) ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {cars.map(item => (
                        <ItemCar
                            key={item.carId}
                            item={item}
                            fav={item}
                        />
                    ))}
                </div>
            ) : (
                <p>Nenhum carro disponível.</p>
            )}
        </div>
    )
}

export default ContainerFav