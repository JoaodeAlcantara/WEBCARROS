import React, { createContext, useContext, useReducer } from "react";
import { Car, CarImage } from "../types";

interface MyCarsProps extends StateType {
    dispatch: React.Dispatch<ActionType>;
}

export interface updatedCar extends Car {
    carImage: CarImage;
    images: File[]
}

type StateType = {
    myCars: Car[];
    fetch: boolean;
    dashboardLoader: boolean;
    updatedCar: updatedCar | null | undefined;
}

type ActionType =
    | { type: 'setMyCar', payload: Car[] }
    | { type: 'setFetch', payload: boolean }
    | { type: 'setDashboardLoader', payload: boolean }
    | { type: 'setUpdatedCar', payload: updatedCar | null | undefined }

const initialValue: StateType = {
    myCars: [],
    fetch: true,
    dashboardLoader: true,
    updatedCar: null,
}

const MyCarsContext = createContext({} as MyCarsProps);

export function MyCarsprovider({ children }: { children: React.ReactElement }) {

    const [state, dispatch] = useReducer(dashboardRecucer, initialValue);

    return (
        <MyCarsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </MyCarsContext.Provider>
    )
}

export function useMyCar() {
    return useContext(MyCarsContext)
}

function dashboardRecucer(state: StateType, action: ActionType) {
    switch (action.type) {
        case 'setMyCar':
            return { ...state, myCars: action.payload };
        case 'setFetch':
            return { ...state, fetch: action.payload };
        case 'setDashboardLoader':
            return { ...state, dashboardLoader: action.payload };
        case 'setUpdatedCar':
            return { ...state, updatedCar: action.payload };
    }
};
