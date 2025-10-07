import cone from '../assets/cone.jpg';
import placa from '../assets/placaNotFound.jpg';
import { Link } from 'react-router-dom';

function NotFound() {

    return (
        <main className="flex flex-col justify-center items-center mt-auto mx-auto bg-white w-full max-w-4xl rounded-2xl shadow-lg p-2">
            <div className='flex flex-col h-full w-full justify-center items-center relative'>
                <div>
                    <div className="flex items-end absolute bottom-4 sm:left-40 lg:left-45 opacity-80">
                        <img src={cone} alt="cone" className='w-25 sm:w-45 h-45 rounded-t-full' />
                    </div>
                    <img src={placa} alt="placa" className='w-95 h-90' />
                </div>

                <div className='w-full max-w-3xl h-1 bg-black relative'>
                    <span className='h-1 w-6 bg-white absolute right-10'></span>
                    <span className='h-1 w-6 bg-white absolute right-40'></span>
                    <span className='h-1 w-6 bg-white absolute left-10'></span>
                </div>
            </div>

            <h1 className='mt-10 text-3xl text-center font-bold'>Pagina Não Encontrada</h1>

            <Link to={'/'} className='my-5 text-center w-full max-w-3xl bg-black py-2 rounded-lg text-white font-semibold hover:bg-black/90 cursor-pointer duration-200'>
                Voltar a Home
            </Link>
        </main>
    )
}

export default NotFound