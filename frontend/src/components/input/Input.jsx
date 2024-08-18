import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
    { label, className = "", placeHolder = "", type = "text", error, ...props },
    ref
) {
    const id = useId();
    return (
        <div className="mb-8">
            <div className="flex justify-center items-center">
                {label && <label className="mr-2 font-semibold">{label}</label>}
                <input
                    id={id}
                    type={type}
                    placeholder={placeHolder}
                    className={`rounded-md p-2 h-7 ${className}`}
                    ref={ref}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs font-semibold text-red-500 mb-5">
                    {`*${error}`}
                </span>
            )}
        </div>
    );
});

export default Input;
