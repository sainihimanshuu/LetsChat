import { useEffect } from "react";
import { useUserContext } from "../context/UserContext.jsx";

const useListenMessage = () => {
    const { setStoreConversation, storeSocket } = useUserContext();

    useEffect(() => {
        storeSocket?.on("chat message", (msg) => {
            setStoreConversation((prevStoreMessages) => {
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
