import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

const UserContext = createContext(null);

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
    const [storeUser, setStoreUser] = useState(null);
    const [storeSocket, setStoreSocket] = useState(null);
    const [storeOnlineUsers, setStoreOnlineUsers] = useState([]);
    const [storeMessages, setStoreMessages] = useState([]);
    const [storeConversation, setStoreConversation] = useState(null);
    const [receiver, setReceiver] = useState(null);
    //    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let socket;
        if (storeUser) {
            socket = io("http://localhost:8000", {
                query: {
                    userId: storeUser.id,
                },
                reconnection: true,
            });

            setStoreSocket(socket);

            socket.on("onlineUsers", (users) => {
                // axiosPrivate
                //     .get("/user/getAllUsers")
                //     .then((users) => setStoreUserList(users));
                setStoreOnlineUsers(users);
            });

            socket.on("reconnect", () => {
                socket.emit("reconnectUser", userId);
            });

            return () => socket.close();
        } else {
            if (socket) {
                console.log("ehool");
                socket.close();
                setStoreSocket(null);
            }
        }
    }, [storeUser]);

    return (
        <UserContext.Provider
            value={{
                storeUser,
                setStoreUser,
                storeSocket,
                setStoreSocket,
                storeOnlineUsers,
                setStoreOnlineUsers,
                storeMessages,
                setStoreMessages,
                storeConversation,
                setStoreConversation,
                receiver,
                setReceiver,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
