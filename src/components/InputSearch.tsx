import { IoCarSportSharp } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useCar } from "../contexts/CarContext";
import { useEffect } from "react";

function InputSearch() {

    const { searchName, dispatch } = useCar();

    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch({ type: 'setFetch', payload: true });
        }, 500);

        return () => clearTimeout(delay);
    }, [searchName]);

    return (
        <section className="bg-white p-2 sm:p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
            <div className="w-full border-1 h-9 px-3 rounded-lg flex items-center justify-center gap-2">
                <IoCarSportSharp size={20} />
                <input
                    placeholder="Digite o nome do carro..."
                    type="text"
                    className="outline-none w-full"
                    value={searchName ?? ""}
                    onChange={(e) => {
                        dispatch({ type: 'setSearchName', payload: e.target.value });
                        }
                    }
                />
                {searchName &&
                    <button className="cursor-pointer" title="limpar"
                    onClick={() => {
                        dispatch({ type: 'setSearchName', payload: '' })
                    }}>
                        <IoMdClose size={20} />
                    </button>}
            </div>
            <button className="w-fit bg-red-600 h-9 px-4 rounded-lg text-white font-medium text-lg cursor-pointer hover:bg-red-700 duration-200">
                <FaMagnifyingGlass size={20} />
            </button>
        </section>
    )
}

export default InputSearch