import { toast } from "react-toastify";

interface ToastConfirmProps {
    message: string;
    onConfirm: (gpName?: string) => void;
    onCancel?: () => void;
}

function ToastConfirm({ message, onConfirm, onCancel }: ToastConfirmProps) {
    return (
        <div className="flex flex-col gap-3 shadow w-full">
            <span>{message}</span>
            <div className="flex gap-2 justify-end">
                <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                    onClick={() => {
                        toast.dismiss();
                        onConfirm();
                    }}
                >
                    sim
                </button>
                <button
                    className="text-white bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                        toast.dismiss();
                        if (onCancel) onCancel();
                    }}
                >
                    não
                </button>
            </div>
        </div>
    );
}

export function showToastConfirm(props: ToastConfirmProps) {
    toast(
        <ToastConfirm {...props} />,
        {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
            theme: "dark",
        }
    );
}
