import SideBar from "../components/Sidebar";
import Container from "../components/Container";
import AccountContainer from "../components/SectionContainer";
import { useFavorite } from "../contexts/FavoriteContext";
import api from "../services/api";
import Loader from "../components/Loader";
import { useEffect } from "react";
import ItemCar from "../components/ItemCar";
import { ToastContainer } from "react-toastify";

function Favorites() {
    const { favLoader, favorites, fetch, dispatch } = useFavorite();

    async function getFavorites() {
        try {
            const req = await api.get('list-favorite-formated/my', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            dispatch({ type: 'setFavorites', payload: req.data.favorites });
            dispatch({ type: 'setFavLoader', payload: false });
        } catch (err: any) {
            console.log(err.response.data);
            dispatch({ type: 'setFavLoader', payload: false });

            if (err.response && err.response.status === 404) {
                dispatch({ type: 'setFavorites', payload: [] });
            }
        }
    }

    useEffect(() => {
        getFavorites();
    }, []);

    useEffect(() => {
        if (fetch) {
            getFavorites();
        }
        dispatch({ type: 'setFetch', payload: false });
    }, [fetch])

    if (favLoader) {
        return <Loader />
    }

    return (
        <>
            <SideBar />
            <Container>
                <AccountContainer>
                    <h1 className="text-2xl font-bold">Favoritos</h1>

                    {!favorites || favorites.length == 0 && (
                        <h1 className="mt-10 mx-10 font-semibold text-xl">Nenhum item presente na sua lista de favoritos.</h1>
                    )
                    }

                    {Object.entries(favorites).map(([gpName, cars]) => (
                        <div key={gpName} className="mb-10 mt-5 rounded-lg p-2">
                            <div className="w-full mb-2 border-b-2 border-gray-400 px-2">
                                <h2 className="text-xl font-bold">{gpName}</h2>
                            </div>

                            {Array.isArray(cars) ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {cars.map(item => (
                                        <ItemCar
                                            key={item.carId}
                                            item={item.car}
                                            fav={item}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>Nenhum carro disponível.</p>
                            )}
                        </div>
                    ))}
                </AccountContainer>
            </Container>
            <ToastContainer containerId={'fav'} />
        </>
    )
}

export default Favorites