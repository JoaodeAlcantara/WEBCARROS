import { useState, useEffect } from "react"
import { Link } from "react-router-dom";

function InfoModal() {

    const [show, setShow] = useState(false);

    useEffect(() => {
        const isClosed = sessionStorage.getItem("loginPopoverClosed");
        if (!isClosed) {
            setShow(true);
        }
    }, []);


    function closeModal() {
        sessionStorage.setItem("loginPopoverClosed", "true");
        setShow(false);
    }

    return (
        <>
            {show &&
                <div className="relative inline-block">

                    <div className="absolute right-8 top-10 w-64 bg-white rounded-xl shadow-lg p-4 text-sm z-10">

                        <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-xs" onClick={closeModal}>✕</button>

                        <p className="mb-4 text-gray-800">Faça login para uma experiência ainda melhor!</p>

                            <Link to={'/login'} className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md">
                                Fazer Login
                            </Link>

                        <p className="mt-3 text-sm text-gray-600">
                            Não tem uma conta?
                            <Link to={'/register'} className="pl-2 font-bold text-red-600 hover:underline">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>
            }
        </>
    )
}

export default InfoModal