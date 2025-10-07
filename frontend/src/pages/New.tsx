import SideBar from "../components/Sidebar";
import Container from "../components/Container";
import { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { FaTrashAlt } from "react-icons/fa";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/Input";
import { FuelType } from "../types";
import { CategoryType } from "../types";
import { TransmissionType } from "../types";
import { ChangeEvent } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useCar } from "../contexts/CarContext";
import { useMyCar } from "../contexts/MyCarsContext";
import SectionContainer from "../components/SectionContainer";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


const schema = z.object({
    name: z.string().nonempty('O nome é obrigatório'),
    model: z.string().nonempty('O modelo é obrigatório'),
    year: z.string().nonempty('O ano do carro é obrigatório'),
    kilometersRun: z.string().nonempty('A kilometragem é obrigatória'),
    price: z.preprocess((val) => {
        if (typeof val === "string") {
            const cleaned = val.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? undefined : parsed;
        }
        return val;
    }, z.number({ invalid_type_error: "Preço inválido", required_error: "O preço é obrigatório" })),
    city: z
        .string()
        .nonempty('A cidade é obrigatória')
        .refine((value) => {
            const parts = value.split(' - ');
            return parts.length === 2 && parts[0].trim() !== '' && parts[1].trim() !== '';
        }, {
            message: 'Informe no formato: cidade - estado'
        }),
    contactPhone: z.string().min(1, 'O telefone é obrigatório').refine(value => /^(\d{10,11})$/.test(value), {
        message: 'Número de telefone inválido'
    }),
    description: z.string().nonempty('A descrição é obrigatória'),
    transmission: z.nativeEnum(TransmissionType, {
        errorMap: () => ({ message: 'Selecione um tipo de câmbio válido' })
    }),
    category: z.nativeEnum(CategoryType, {
        errorMap: () => ({ message: 'Selecione uma categoria válida' })
    }),
    fuel: z.nativeEnum(FuelType, {
        errorMap: () => ({ message: 'Selecione um tipo de combustível válido' })
    })
});

type formData = z.infer<typeof schema>;

interface carImage {
    id: number,
    filename: string,
    carId: number
}

function New() {

    const [images, setImages] = useState<File[]>([]);
    const { dispatch } = useCar();
    const { updatedCar, dispatch: myCarDispatch } = useMyCar();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const newCarImage = useRef<carImage[]>(updatedCar?.carImages ? [...updatedCar.carImages] : []);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<formData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: updatedCar ? { ...updatedCar, kilometersRun: String(updatedCar.kilometersRun), price: Number(updatedCar.price) } : undefined
    });

    function buildFormData(data: formData | null, images: File[] | null) {
        const form = new FormData();
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                form.append(key, String(value));
            });
        }
        if (images) {
            images.forEach(img => form.append('images', img));
        }

        return form;
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if (['image/jpeg', 'image/jpg', 'image/png'].includes(image.type)) {
                if (images.length < 10) {
                    setImages(all => [...all, image]);

                    if (updatedCar) {
                        const formImage = buildFormData(null, [image]);

                        const req = await api.post(`/add-image/id/${updatedCar.id}`, formImage, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            },
                        });
                        newCarImage.current = [...newCarImage.current, req.data.car.carImages];
                    }
                } else {
                    toast.error('Limite de imagem atingido', {
                        containerId: 'err',
                        position: "top-center",
                        autoClose: 4000,
                        pauseOnHover: false,
                        theme: 'dark'
                    });
                }
            } else {
                toast.error('Formato de imagem invalido', {
                    containerId: 'err',
                    position: "top-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    theme: 'dark'
                });
            }
        }
    }

    useEffect(() => {
        if (!updatedCar) {
            reset();
        } else {
            setImages(updatedCar.images);
        }

        return () => {
            myCarDispatch({ type: 'setUpdatedCar', payload: null });
        }
    }, [])

    async function onSubmit(data: formData) {

        if (images.length < 2) {
            toast.error('Adicione ao menos 2 imagem', {
                containerId: 'err',
                position: "bottom-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
            return;
        }

        if (updatedCar) {
            try {
                const formData = buildFormData(data, null);

                await api.put(`/update-car/id/${updatedCar.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });

                dispatch({ type: 'setFetch', payload: true });
                dispatch({ type: 'setCarLoader', payload: true });
                myCarDispatch({ type: 'setFetch', payload: true });
                myCarDispatch({ type: 'setDashboardLoader', payload: true });

                myCarDispatch({ type: 'setUpdatedCar', payload: null });
                reset();

                localStorage.setItem('toastSuccess', 'true');

                navigate('/dashboard');

            } catch (err) {
                console.log(err);
                toast.error('Erro ao atualizar carros', {
                    containerId: 'err',
                    position: "bottom-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    theme: 'dark'
                });
            }

        } else {
            try {
                const formData = buildFormData(data, images);

                await api.post('add-car', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });

                reset();
                setImages([]);

                toast.success('Carro adicionado com sucesso', {
                    containerId: 'err',
                    position: "bottom-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    theme: 'dark'
                });

                dispatch({ type: 'setFetch', payload: true })
                myCarDispatch({ type: 'setFetch', payload: true })
            } catch (err) {
                console.log(err);
                toast.error('Erro ao cadastrar carros', {
                    containerId: 'err',
                    position: "bottom-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    theme: 'dark'
                });
            }
        }
    }

    async function handleRemoveImage(i: number) {
        if (updatedCar) {
            const id = newCarImage.current[i].id;
            try {
                const req = await api.delete(`delete-image/car/${updatedCar.id}/img/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });

                console.log(req.data)
                console.log('imagem', id, 'removida');
                setImages(() => images.filter((_, index) => index !== i));
                newCarImage.current.splice(i, 1);
            } catch (err) {
                console.log('erro ao deletar imagem', err);
            }
        } else {
            setImages(() => images.filter((_, index) => index !== i));
        }
    }

    return (
        <>
            <SideBar />
            <Container>
                <SectionContainer>
                    <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 relative">
                            <div className="absolute cursor-pointer">
                                <FiUpload size={30} />
                            </div>
                            <div className="absolute cursor-pointer">
                                <input
                                    type="file" accept="image/*"
                                    onChange={handleFile}
                                    className="cursor-pointer w-48 h-32 opacity-0"
                                />
                            </div>
                        </button>

                        <div className="flex gap-2 w-full h-38 items-center overflow-auto">
                            {images.map((img, i) => (
                                <div key={img.lastModified} className="relative group flex-shrink-0">
                                    <FaTrashAlt
                                        size={22}
                                        className="absolute z-10 translate-x-1/2 translate-y-1/2 text-red-600 cursor-pointer hover:scale-105 hover:text-red-700 duration-200"
                                        onClick={() => handleRemoveImage(i)}
                                    />
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={img.name}
                                        className="rounded-lg h-32 object-contain flex-shrink-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full p-3 bg-white rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                        <form className="w-full"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="mb-3">
                                <p className="mb-2 font-medium">Nome do carro: </p>
                                <Input
                                    type="text"
                                    register={register}
                                    name="name"
                                    error={errors.name?.message}
                                    placeholder="Ex: Onix 1.0 ..."
                                />
                            </div>
                            <div className="mb-3">
                                <p className="mb-2 font-medium">Modelo: </p>
                                <Input
                                    type="text"
                                    register={register}
                                    name="model"
                                    error={errors.model?.message}
                                    placeholder="Ex: 1.0 flex PLUS ..."
                                />
                            </div>

                            <div className="flex w-full flex-col sm:flex-row gap-5">
                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Ano: </p>
                                    <Input
                                        type="text"
                                        register={register}
                                        name="year"
                                        error={errors.year?.message}
                                        placeholder="Ex: 2022/2023"
                                    />
                                </div>
                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">KM rodados: </p>
                                    <Input
                                        type="text"
                                        register={register}
                                        name="kilometersRun"
                                        error={errors.kilometersRun?.message}
                                        placeholder="Ex: 2500"
                                    />
                                </div>
                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Preço: </p>
                                    <Input
                                        type="text"
                                        register={register}
                                        name="price"
                                        error={errors.price?.message}
                                        placeholder="Ex: 120000"
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-col sm:flex-row gap-5">
                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Câmbio: </p>
                                    <select
                                        {...register("transmission")}
                                        className="border-2 rounded-md w-full p-2 border-gray-400"
                                    >
                                        <option value="">Selecione</option>
                                        {Object.values(TransmissionType).map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    {errors.transmission && <p className="text-red-600 pl-2 my-1">* {errors.transmission.message}</p>}
                                </div>

                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Categoria: </p>
                                    <select
                                        {...register("category")}
                                        className="border-2 rounded-md w-full p-2 border-gray-400"
                                    >
                                        <option value="">Selecione</option>
                                        {Object.values(CategoryType).map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-600 pl-2 my-1">* {errors.category.message}</p>}
                                </div>

                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Combustível: </p>
                                    <select
                                        {...register("fuel")}
                                        className="border-2 rounded-md w-full p-2 border-gray-400"
                                    >
                                        <option value="">Selecione</option>
                                        {Object.values(FuelType).map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    {errors.fuel && <p className="text-red-600 pl-2 my-1">* {errors.fuel.message}</p>}
                                </div>
                            </div>

                            <div className="flex w-full flex-col sm:flex-row gap-5">
                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Cidade - Estado: </p>
                                    <Input
                                        type="text"
                                        register={register}
                                        name="city"
                                        error={errors.city?.message}
                                        placeholder="Ex: São Paulo - SP"
                                    />
                                </div>
                                <div className="mb-3 flex-1">
                                    <p className="mb-2 font-medium">Whatsapp: </p>
                                    <Input
                                        type="text"
                                        register={register}
                                        name="contactPhone"
                                        error={errors.contactPhone?.message}
                                        placeholder="Ex: 24111223344"
                                    />
                                </div>
                            </div>
                            <div className="mb-3 flex-1">
                                <p className="mb-2 font-medium">Descrição: </p>
                                <textarea
                                    className="border-2 border-gray-400 focus:border-gray-600 w-full rounded-md h-24 px-2 resize-none"
                                    {...register('description')}
                                    name="description"
                                    id="description"
                                    placeholder="Digite a descrição completa sobre o veiculo..."
                                ></textarea>
                                {errors.description && <p className="text-red-600 pl-2 my-1">* {errors.description.message}</p>}
                            </div>

                            <button type="submit" className="w-full bg-zinc-900 h-12 rounded-md text-white font-semibold text-lg cursor-pointer hover:bg-zinc-800 active:scale-95 duration-200">
                                {updatedCar ? 'Salvar' : 'Cadastrar'}
                            </button>
                        </form>
                    </div>
                </SectionContainer>
            </Container>
            <ToastContainer containerId={'err'} />
        </>
    )
}

export default New