import logoImg from '../assets/logo.svg'
import { Link } from 'react-router-dom';
import { FiUser, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../contexts/authContext';
import InfoModal from "../components/InfoModal";
import { useCar } from '../contexts/CarContext';

function Header() {

    const { signed } = useAuth();
    const { carLoader } = useCar();

    return (
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4 relative z-50'>
            <header className='w-full max-w-7xl flex justify-between items-center px-4 mx-auto'>
                <Link to={'/'}>
                    <img src={logoImg} alt="logo do site" />
                </Link>

                {
                    signed ?
                        <Link to={'/dashboard'}>
                            <div className='border-2 rounded-full sm:border-0 sm:rounded-none  sm:border-b-2 p-1 border-gray-900 flex items-center justify-center gap-2 font-semibold hover:bg-gray-200 duration-200 hover:rounded-t-md'>
                                <span className='hidden sm:block'>Meu Perfil</span>
                                <FiUser size={22} color='#000' />
                            </div>
                        </Link>
                        :
                        <Link to={'/login'}>
                            <div className='border-2 rounded-full sm:border-0 sm:rounded-none  sm:border-b-2 p-1 border-gray-900 flex items-center justify-center gap-2 font-semibold hover:bg-gray-200 duration-200 hover:rounded-t-md'>
                                <span className='font-semibold'>Entrar</span>
                                <FiLogIn size={22} color='#000' />
                            </div>
                        </Link>
                }
            </header>
                {!signed && !carLoader && <InfoModal />}
        </div>
    )
}

export default Header