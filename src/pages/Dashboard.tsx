import SideBar from "../components/Sidebar";
import Container from "../components/Container";
import SectionContainer from "../components/SectionContainer";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import api from "../services/api";
import ItemCar from "../components/ItemCar";
import { useMyCar } from "../contexts/MyCarsContext";


function Dashboard() {

    const { fetch, dashboardLoader, myCars, dispatch } = useMyCar();

    async function getDashboardCars() {
        try {
            const req = await api.get('list-car/my', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!req.data.status) {
                toast.error('Erro ao buscar informções', {
                    containerId: 'dash',
                    position: "top-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    theme: 'dark'
                });
            }

            dispatch({ type: 'setDashboardLoader', payload: false });
            dispatch({ type: 'setMyCar', payload: req.data.cars });
        } catch (err: any) {
            console.log(err);
            toast.error(`${err.response.data.message}`, {
                containerId: 'dash',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: 'dark'
            });
        }
    };

    useEffect(() => {
        const success = localStorage.getItem('toastSuccess');
        if (success) {
            setTimeout(() => {
                toast.success('Informações salvas com sucesso', {
                    containerId: 'dash',
                    position: "bottom-center",
                    autoClose: 4000,
                    pauseOnHover: false,
                    theme: 'dark'
                });
                localStorage.removeItem('toastSuccess');
            }, 200)
        }
    }, []);

    useEffect(() => {
        if (fetch) {
            getDashboardCars();
        }
        dispatch({ type: 'setFetch', payload: false });
    }, [fetch]);

    useEffect(() => {
        getDashboardCars();
        dispatch({ type: 'setFetch', payload: false });
    }, []);

    if (dashboardLoader) {
        return <Loader />
    }

    return (
        <>
            <SideBar />
            <Container>
                <SectionContainer>
                    <h1 className="text-2xl font-bold mb-4">Meus Carros</h1>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ml-2">
                        {myCars.length === 0 ?
                            <p className="col-span-full text-xl text-center font-semibold mt-6">Você ainda não adicionou nenhum carro</p>
                            :
                            myCars.map(item => (
                                <ItemCar key={item.id} item={item} />
                            ))
                        }
                    </div>
                </SectionContainer>
            </Container>

            <ToastContainer containerId={'dash'} />
            <ToastContainer containerId={'menuErr'} />
        </>
    )
}

export default Dashboard