import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { User } from "../types";


interface AuthProps {
    auth: User | null;
    setAuth: React.Dispatch<User | null>;
    signed: boolean;
    authLoader: boolean;
    getUser: () => void;
}

const AuthContext = createContext({} as AuthProps);

export function AuthProvider({ children }: { children: React.ReactElement }) {

    const [auth, setAuth] = useState<User | null>(null);
    const [authLoader, setAuthLoader] = useState(true);

    async function getUser() {
        try {
            const token = localStorage.getItem('token') ?
                localStorage.getItem('token') : null;

            const req = await api.get('/list-user-id', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAuth(req.data.user);
            setAuthLoader(false);

        } catch (err) {
            console.error('Erro ao buscar usuário:', err);
            localStorage.removeItem('token');
            setAuth(null);
            setAuthLoader(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                auth, setAuth, authLoader, getUser, signed: !!auth
            }}>
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
    return useContext(AuthContext);
};

