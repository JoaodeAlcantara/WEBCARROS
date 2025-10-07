import SideBar from "../components/Sidebar";
import Container from "../components/Container";
import AccountContainer from "../components/SectionContainer";
import { useFavorite } from "../contexts/FavoriteContext";
import api from "../services/api";
import Loader from "../components/Loader";
import { useEffect } from "react";
import ContainerFav from "../components/ContainerFav";

function Favorites() {
    const { favLoader, favorites, fetch, dispatch } = useFavorite();
    

    async function getFavorites() {
        try {
            const req = await api.get('list-favorite-formated/my', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(req)

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
                        <ContainerFav key={gpName} gpName={gpName} cars={cars} />
                    ))}
                </AccountContainer>
            </Container>
        </>
    )
}

export default Favorites