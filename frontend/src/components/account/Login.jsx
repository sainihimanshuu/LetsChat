import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "../input/index.js";
import { useState } from "react";
import useLogin from "../../hooks/useLogin.js";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
    email: z.string().email().trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

export default function Login() {
    const [isValidCredentials, setIsValidCredentials] = useState(true);
    const login = useLogin();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema) });

    const handleLogin = (data) => {
        try {
            login(data, setIsValidCredentials);
            navigate("/");
        } catch (error) {
            console.log("error while logging in (handleLogin)", error);
        }
    };

    return (
        <div className="bg-lightBrown shadow-2xl rounded-[20px] w-80 h-[22rem] mx-auto mt-16 relative">
            <h2 className="text-darkBrown text-xl font-bold absolute top-0 right-0 bottom-0 left-0 mt-6">
                Login
            </h2>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="absolute top-0 right-0 bottom-0 left-0 mt-24"
            >
                <Input
                    className="w-3/4"
                    placeHolder="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    className="w-3/4"
                    placeHolder="password"
                    type="password"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Button className="myButton" type="submit">
                    LogIn
                </Button>
                {!isValidCredentials && (
                    <span className="text-xs font-semibold text-red-500">
                        Invalid credentials
                    </span>
                )}
            </form>
        </div>
    );
}
