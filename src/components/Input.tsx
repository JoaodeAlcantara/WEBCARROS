import { RegisterOptions, UseFormRegister} from "react-hook-form";

interface InputProps{
    type: string;
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions
}

function Input({name, type, placeholder, register, rules, error }: InputProps){

    return (
        <div>
            <input 
                className="w-full border-2 border-gray-400 rounded-md h-10 px-1 outline-none focus:border-gray-600"
                placeholder={placeholder} 
                type={type}
                {...register(name, rules)}
                id={name}
            />
            {error && <p className="text-red-600 pl-2 my-1">* {error}</p>}
        </div>
    )
}

export default Input