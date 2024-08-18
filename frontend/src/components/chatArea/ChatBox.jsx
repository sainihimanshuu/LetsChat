import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { Input, Button } from "../input/index.js";

export default function ChatBox() {
    const { receiver, storeConversation, storeOnlineUsers, storeUser } =
        useUserContext();
    const [isOnline, setIsOnline] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (storeOnlineUsers.includes(receiver?.id)) {
            setIsOnline(true);
        } else {
            setIsOnline(false);
        }
    }, [storeOnlineUsers]);

    const handleSend = () => {};

    console.log(storeConversation);

    return storeConversation ? (
        <div className="h-full relative">
            <div className="h-full w-full grid grid-cols-1 grid-rows-6">
                <div className="p-1 flex justify-start items-center border-b-darkBrown border-2 row-start-1 row-end-2">
                    <img
                        className="size-12"
                        src={
                            receiver?.avatarUrl
                                ? receiver?.avatarUurl
                                : "/no-profile-picture-15257.svg"
                        }
                    />
                    <h1 className="ml-3 font-semibold text-darkBrown">
                        {receiver?.username}
                    </h1>
                </div>
                <div className="bg-lightBrown row-start-2 row-end-6 overflow-auto">
                    {storeConversation?.length === 0 ? (
                        <h1>Start conversation</h1>
                    ) : (
                        storeConversation.map((message) => {
                            // const msgAuthor =
                            //     storeUser.id === message.receiver
                            //         ? "chat-start"
                            //         : "chat-end";
                            return (
                                <div>
                                    <div
                                        className=" bg-darkBrown text-lightBrown font-semibold"
                                        //ref={lastMsgRef}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="flex justify-between items-center bg-lightBrown border-t-2 border-darkBrown row-start-6">
                    <Input
                        type="text"
                        placeholder="message"
                        className="w-80 mt-8 ml-3"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                    />
                    <Button className="myButton" onClick={handleSend}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    ) : (
        <h1>Open up a chat</h1>
    );
}
