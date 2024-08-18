import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext.jsx";

export default function LogoutButton() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { storeUser, setStoreUser } = useUserContext();

    const handleLogout = () => {
        axiosPrivate
            .post("/user/logoutUser")
            .then((response) => {
                localStorage.removeItem(`token${storeUser.id}`);
                localStorage.removeItem(`user${storeUser.id}`);
                setStoreUser(null);
                // const socket = useSelector((state) => state.socket.userSocket);
                // socket.close(); //or socket.disconnet();
                //dispatch({ type: "socket/disconnect" });
            })
            .catch((error) => console.log("error while logging out", error))
            .finally(() => navigate("/"));
    };
    return (
        <div>
            <Button className="myButton" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}
