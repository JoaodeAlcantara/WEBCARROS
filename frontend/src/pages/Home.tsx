import Container from "../components/Container"
import ItemCar from "../components/ItemCar";
import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { useCar } from "../contexts/CarContext";
import { useFavorite } from "../contexts/FavoriteContext";
import Loader from "../components/Loader";
import { ToastContainer } from 'react-toastify';
import api from "../services/api";
import InputSearch from "../components/InputSearch";
import FavoriteModal from "../components/FavoiteModal";


function Home() {

    const { authLoader } = useAuth();
    const { cars, carLoader, dispatch, fetch, searchName } = useCar();
    const { showModal } = useFavorite();

    async function getCars() {
        try {

            const params = { name: '' };

            if (searchName) params.name = searchName;

            const req = await api.get('/list-car', {
                params: params
            });

            dispatch({ type: 'setCar', payload: req.data.cars });
            dispatch({ type: 'setCarLoader', payload: false });

        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getCars()
    }, []);

    useEffect(() => {
        if (fetch) {
            getCars()
        }
        dispatch({ type: 'setFetch', payload: false });
    }, [fetch]);


    if (authLoader || carLoader) {
        return <Loader />
    }

    return (
        <>
            {showModal && <FavoriteModal />}

            <Container>
                <InputSearch />

                <h1 className="font-bold text-center mt-6 text-2xl mb-4">
                    Carros novos e usados em todo o Brasil
                </h1>

                <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {cars.map(item => (
                        <ItemCar
                            key={item.id}
                            item={item}
                            fav={item.favorites}
                        />)
                    )
                    }
                </main>
            </Container>
            <ToastContainer containerId={'exp'} />
            <ToastContainer containerId={'fav'} />
        </>
    )
}

export default Home