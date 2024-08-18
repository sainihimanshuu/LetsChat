import { useEffect } from "react";
import { useUserContext } from "../context/UserContext.jsx";

const useListenMessage = () => {
    const { setStoreMessages, storeSocket } = useUserContext();

    useEffect(() => {
        storeSocket?.on("chat message", (msg) => {
            setStoreMessages((prevStoreMessages) => {
                if (prevStoreMessages) {
                    return [...prevStoreMessages, msg];
                }
                return [msg];
            });
        });

        return () => storeSocket?.off("chat message");
    }, []);
};

export default useListenMessage;
