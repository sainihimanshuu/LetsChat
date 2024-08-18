import axios from "../axios/axios.js";
import { useUserContext } from "../context/UserContext.jsx";

const useLogin = () => {
    const { setStoreUser } = useUserContext();
    const login = (data, setIsValidCredentials) => {
        axios
            .post("/user/loginUser", data)
            .then((response) => {
                setStoreUser(response.data.user);
                setIsValidCredentials(true);
                localStorage.setItem(
                    `token${response.data.user.id}`,
                    JSON.stringify(response.data.accessToken)
                );
                localStorage.setItem(
                    `user${response.data.user.id}`,
                    JSON.stringify(response.data.user)
                );
            })
            .catch((error) => {
                console.log("error while logging in", error);
                setIsValidCredentials(false);
            });
    };

    return login;
};

export default useLogin;
