import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { useUserContext } from "../../context/UserContext.jsx";

export default function UserList() {
    const axiosPrivate = useAxiosPrivate();
    const { storeOnlineUsers, setReceiver, setStoreConversation } =
        useUserContext();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosPrivate
            .get("/user/getAllUsers")
            .then((response) => {
                setUserList(response.data.updatedUsers);
                setLoading(false);
            })
            .catch((error) =>
                console.log("error while fetching users in Userlist", error)
            );
    }, [storeOnlineUsers]);

    const handleClick = (user) => {
        axiosPrivate
            .get(`/message/getMessages/${user.id}`)
            .then((response) => {
                console.log(Object.keys(response.data));
                setStoreConversation(response.data);
            })
            .catch((error) =>
                console.log(
                    "error while fetching conversation in userList",
                    error
                )
            );
        setReceiver(user);
    };

    return !loading ? (
        <div className="overflow-auto">
            {userList.length === 0 ? (
                <h1>No Users</h1>
            ) : (
                userList.map((user) => (
                    <div
                        className="flex items-center m-1 p-1 border-2 border-darkBrown clickableDiv rounded-lg"
                        onClick={() => handleClick(user)}
                    >
                        <img
                            className="size-12"
                            src={
                                user?.avatarUrl
                                    ? user?.avatarUrl
                                    : "/no-profile-picture-15257.svg"
                            }
                        />
                        <h1 className="ml-3 font-semibold text-darkBrown">
                            {user.username}
                        </h1>
                    </div>
                ))
            )}
        </div>
    ) : (
        <h1>Loading...</h1>
    );
}
