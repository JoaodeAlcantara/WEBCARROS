import React, { createContext, useContext, useReducer } from "react";
import { FavoriteGroup } from "../types";
import api from "../services/api";

interface Favprops extends stateType {
    dispatch: React.Dispatch<actionType>;
    deleteFavoriteItem: (id: number) => Promise<boolean>;
}

type stateType = {
    favorites: FavoriteGroup[],
    fetch: boolean,
    favLoader: boolean,
    showModal: boolean,
    carId: number | null
}

type actionType = 
| { type: 'setFavorites', payload: FavoriteGroup[] }
| { type: 'setFetch', payload: boolean }
| { type: 'setFavLoader', payload: boolean }
| { type: 'setShowModal', payload: boolean }
| { type: 'setCarId', payload: number | null }


const initialValue = {
    favorites: [],
    fetch: false,
    favLoader: true,
    showModal: false,
    carId: null
}

const FavoriteContext = createContext({} as Favprops);

export function FavoriteProvider({ children }: { children: React.ReactElement }) {

    const token = localStorage.getItem('token')
    const [state, dispatch] = useReducer(favReducer, initialValue);

    async function deleteFavoriteItem(id: number){
        try {
            const req = await api.delete(`/delete-favorite-item/id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!req.data.ok) return false;

            return true

        } catch (err){
            console.log(err);
            return false
        }
    }

    return (
        <FavoriteContext.Provider value={{ ...state, dispatch, deleteFavoriteItem }}>
            {children}
        </FavoriteContext.Provider>
    )
}

export function useFavorite() {
    return useContext(FavoriteContext);
}

function favReducer(state: stateType, action: actionType ) {
    switch (action.type) {
        case 'setFavorites':
            return { ...state, favorites: action.payload };
        case 'setFetch':
            return { ...state, fetch: action.payload };
        case 'setFavLoader':
            return { ...state, favLoader: action.payload };
        case 'setShowModal':
            return { ...state, showModal: action.payload };
        case 'setCarId':
            return { ...state, carId: action.payload };
    }
}