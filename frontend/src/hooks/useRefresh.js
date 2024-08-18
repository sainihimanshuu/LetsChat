import axios from "../axios/axios.js";
import { useUserContext } from "../context/UserContext.jsx";

const useRefresh = () => {
    const { storeUser } = useUserContext();

    const refresh = async () => {
        try {
            const response = await axios.get("/user/refreshToken", {
                withCredentials: true,
            });

            console.log("store user in useRefresh", storeUser);

            localStorage.setItem(
                `token${storeUser?.id}`,
                JSON.stringify(response.data.accessToken)
            );

            return response.data.accessToken;
        } catch (error) {
            console.log("error while refreshing tokens in useRefresh", error);
        }
    };

    return refresh;
};

export default useRefresh;
