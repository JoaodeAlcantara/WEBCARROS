import { ReactNode } from "react";
import { useAuth } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

interface PrivateProps {
    children: ReactNode
}

export function Private({ children }: PrivateProps){
    const { signed, authLoader } = useAuth();

    if(authLoader) {
        return;
    }

    if(!signed){
        return <Navigate to={'/login'} />
    }

    return children;

}