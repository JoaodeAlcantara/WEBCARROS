import { FaTrashAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";
import { useMyCar } from "../contexts/MyCarsContext";
import { useCar } from "../contexts/CarContext";
import { useNavigate } from "react-router-dom";
import { CarImage } from "../types";
import { showToastConfirm } from "./ToastConfirm";

interface MenuProps {
    showMenu: boolean;
    id: number
}

function CarMenu({ showMenu, id }: MenuProps) {

    const { dispatch, myCars } = useMyCar();
    const { dispatch: carDispatch } = useCar();
    const navigate = useNavigate();

    async function handleDelete() {
        try {
            await api.patch(`/delete-car/id/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            dispatch({ type: 'setFetch', payload: true });
            carDispatch({ type: 'setCarLoader', payload: true });

            toast.success('Carro deletado com sucesso', {
                containerId: 'menuErr',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
        } catch (err) {
            console.log(err)
            toast.error('Erro ao deletar carro', {
                containerId: 'menuErr',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
        }
    }

    async function handleUpdateStatus(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        try {
            await api.patch(`/update-status/id/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            dispatch({ type: 'setFetch', payload: true });
            carDispatch({ type: 'setFetch', payload: true });
            carDispatch({ type: 'setCarLoader', payload: true });

            const car = myCars.find(item => item.id === id)

            toast.success(`Carro ${car?.previousStatus}`, {
                containerId: 'menuErr',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
        } catch (err) {
            console.log(err)
            toast.error('Erro ao ocultar carro', {
                containerId: 'menuErr',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
        }
    }

    async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: mimeType });
    }

    async function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        try {
            const req = await api.get(`/list-car/id/${id}`);
            const imagesObj = req.data.car.carImages;

            const imageFiles: File[] = await Promise.all(
                imagesObj.map(async (item: CarImage) => {
                    const url = `http://localhost:3000/files/${item.filename}`;
                    const mimeTyepe = item.filename.split('.')[1];
                    const file = await urlToFile(url, item.filename, mimeTyepe);
                    return file;
                })
            );

            const car = {
                ...req.data.car,
                images: imageFiles
            };

            dispatch({ type: 'setUpdatedCar', payload: car });
            navigate('/dashboard/new');

        } catch (err) {
            console.error(err);
            toast.error('Erro ao obter informações do carro', {
                containerId: 'menuErr',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
        }
    }

    return (
        <>
            {
                showMenu &&
                <div className="relative z-20">
                    <div className="absolute -top-56 right-10 flex my-8 mx-2 gap-4 transition-all duration-200">
                        <button className="bg-white p-2 rounded-full cursor-pointer" title="deletar" onClick={(e) => {
                            e.preventDefault();

                            showToastConfirm({
                                message: "Deseja deletar esse carro?",
                                onConfirm: handleDelete,
                                onCancel: () => { }
                            })
                        }}>
                            <FaTrashAlt className="hover:text-red-600 duration-100" />
                        </button>
                        <button className="bg-white p-2 rounded-full cursor-pointer" onClick={(e) => handleEdit(e)}>
                            <FaPen className="hover:text-blue-600 duration-100" title="editar" />
                        </button>
                        <button className="bg-white p-2 rounded-full cursor-pointer" title="ocultar" onClick={(e) => handleUpdateStatus(e)}>
                            <FaEye className="hover:text-gray-600 duration-100" />
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default CarMenu