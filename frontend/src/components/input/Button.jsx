export default function Button({
    children,
    type = "button",
    bgColor = "",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <div>
            <button
                className={`${bgColor} ${textColor} ${className}`}
                type={type}
                {...props}
            >
                {children}
            </button>
        </div>
    );
}
