import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import { IoCarSportSharp } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../contexts/authContext";
import { ToastContainer } from "react-toastify";
import { showToastConfirm } from "./ToastConfirm";
import { useMyCar } from "../contexts/MyCarsContext";


function SideBar() {

    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { dispatch } = useMyCar();

    function handleLogout() {
        navigate('/');
        dispatch({type: 'setMyCar', payload: []})
        sessionStorage.removeItem("loginPopoverClosed");
        setTimeout(() => {
            localStorage.removeItem('token');
            setAuth(null);
        }, 200)
    }

    const itensMenu = [
        {
            icon: <MdOutlineDashboard size={25} />,
            nome: 'Dashboard',
            link: '/dashboard'
        },
        {
            icon:
                <div className="relative">
                    <span className="-top-3 -left-2 px-1 absolute font-bold">+</span>
                    <IoCarSportSharp size={25} />
                </div>,
            nome: 'Novo carro',
            link: '/dashboard/new'
        },
        {
            icon: <MdFavorite size={25} />,
            nome: 'Favoritos',
            link: '/dashboard/favorites'
        },
    ];

    return (
        <>
        <ToastContainer />

            <div className="m-2 cursor-pointer absolute sm:fixed z-30 left-3 top-16" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ?
                    <AiOutlineMenuFold size={35} />
                    :
                    <AiOutlineMenuUnfold size={35} />
                }
            </div>
            <div className={`h-full fixed top-0 z-20 bg-white px-4 transition-all duration-300 shadow  ${isOpen ? 'w-54 block' : 'w-20 hidden sm:block'
                }`}>
                <nav className="flex flex-col h-2/3 mt-40 gap-10 font-semibold">
                    {itensMenu.map(item => (
                        <Link to={item.link} key={item.nome} className={`flex items-center hover:bg-gray-300 p-2 rounded-lg duration-200 whitespace-nowrap ${isOpen ? 'w-full' : 'w-fit'}`}>
                            {item.icon}
                            <span className={`transition-all duration-300 ${isOpen ? 'opacity-100 ml-4' : 'opacity-0 overflow-hidden w-0'}`}>{item.nome}</span>
                        </Link>
                    ))
                    }
                </nav>

                <button onClick={() =>
                    showToastConfirm({
                        message: "Deseja sair da conta?",
                        onConfirm: handleLogout,
                        onCancel: () => { }
                    })
                } className={`flex items-center hover:bg-gray-300 p-2 rounded-lg duration-200 cursor-pointer whitespace-nowrap w-full ${isOpen ? 'w-full' : 'w-fit'}`}>
                    <CiLogout size={25} />
                    <span className={`transition-all duration-300 ${isOpen ? 'opacity-100 ml-4' : 'opacity-0 w-0 overflow-hidden'}`}>Sair da conta</span>
                </button>
            </div>

            {isOpen && (
                <div className="w-full h-[95vh] fixed z-10" onClick={() => setIsOpen(false)}></div>
            )}
        </>
    )
}

export default SideBar