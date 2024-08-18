import { axiosPrivate } from "../axios/axios.js";
import { useEffect } from "react";
import useRefresh from "./useRefresh.js";
import { useUserContext } from "../context/UserContext.jsx";

const useAxiosPrivate = () => {
    const refresh = useRefresh();
    const { storeUser } = useUserContext();

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            (request) => {
                if (!request.headers["Authorization"]) {
                    request.headers["Authorization"] = `Bearer ${JSON.parse(
                        localStorage.getItem(`token${storeUser.id}`)
                    )}`;
                }
                return request;
            },
            (error) => {
                console.log("error while intercepting request", error);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers["Authorization"] =
                        `Bearer ${newAccessToken}`;
                    return axiosPrivate.request(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        };
    }, [refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
