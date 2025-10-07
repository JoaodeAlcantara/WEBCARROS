import React, { createContext, useContext, useReducer } from "react";
import { Car } from "../types";

interface CarProps extends stateType {
    dispatch: React.Dispatch<actionType>;
}

type stateType = {
    cars: Car[],
    fetch: boolean,
    carLoader: boolean,
    searchName: string | null,
}


type actionType =
    | { type: 'setCar', payload: Car[] }
    | { type: 'setFetch', payload: boolean }
    | { type: 'setCarLoader', payload: boolean }
    | { type: 'setSearchName', payload: string }

const initialValue = {
    cars: [],
    fetch: false,
    carLoader: true,
    searchName: ''
}

const CarContext = createContext({} as CarProps);

export function Carprovider({ children }: { children: React.ReactElement }) {

    const [state, dispatch] = useReducer(carReducer, initialValue);

    return (
        <CarContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CarContext.Provider>
    )
}

export function useCar() {
    return useContext(CarContext)
}

function carReducer(state: stateType, action: actionType) {
    switch (action.type) {
        case 'setCar':
            return { ...state, cars: action.payload };
        case 'setFetch':
            return { ...state, fetch: action.payload };
        case 'setCarLoader': 
            return { ...state, carLoader: action.payload };
        case 'setSearchName': 
            return { ...state, searchName: action.payload };
    }
}