import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.svg';
import Container from '../components/Container';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

type ViewPassword = | 'password' | 'text'

const schema = z.object({
    email: z.string().email('Insira um email valido').nonempty('O campo email é obrigatório'),
    password: z.string().nonempty('O campo senha é obrigatótio')
})

type FormData = z.infer<typeof schema>

function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const { getUser } = useAuth();
    const [msgError, setMsgError] = useState('');
    const navigate = useNavigate();
    const [viewPassword, setViewPassword] = useState<ViewPassword>('password')

    useEffect(() => {
        async function handleLogout() {
            localStorage.removeItem('token');
        };

        handleLogout();
    }, []);

    async function onSubmit(data: FormData) {
        try {
            const req = await api.post('/login', data);
            const token = req.data.token;

            localStorage.setItem('token', token);
            getUser();

            navigate('/', { replace: true });

        } catch (err: any) {
            console.log(err);
            if (err.response.data.message) {
                setMsgError(err.response.data.message);
            } else {
                setMsgError('Erro no servidor');
            }
        }
    }

    return (
        <Container>
            <div className='flex flex-col min-h-screen w-full gap-4 items-center justify-center'>
                <Link to={'/'} className='mb-6 max-w-sm w-full'>
                    <img src={logoImg} alt={'Logo do site'}
                        className='w-full'
                    />
                </Link>

                <form
                    className='bg-white max-w-xl w-full rounded-lg p-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='mb-3 flex flex-col'>
                        <span className='font-semibold p-1'>
                            * Digite seu email:
                        </span>
                        <Input
                            type='email'
                            name='email'
                            placeholder='exemplo@email.com'
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>
                    <div className='mb-3'>
                        <span className='font-semibold p-1'>
                            * Digite sua senha:
                        </span>
                        <div className='relative'>
                            <Input
                                type={viewPassword}
                                name='password'
                                placeholder='******'
                                error={errors.password?.message}
                                register={register}
                            />
                            <button type='button' onClick={() => setViewPassword(viewPassword === 'password' ? 'text' : 'password')} className='absolute top-3 right-2 cursor-pointer'>
                                {
                                    viewPassword === 'password' ?
                                        <FaEye size={20} /> :
                                        <FaEyeSlash size={20} />
                                }
                            </button>
                        </div>
                    </div>

                    {msgError && (
                        <span className='text-red-600 px-2'> * {msgError}</span>
                    )}

                    <button className='bg-zinc-900 rounded-md text-white h-10 cursor-pointer w-full font-medium hover:bg-zinc-800 active:scale-95 duration-200 mt-4' type='submit'>
                        Acessar
                    </button>
                </form>

                <Link to={'/register'}>
                    Não possui uma conta? Cadastre-se
                </Link>
            </div>
        </Container>
    )
}

export default Login