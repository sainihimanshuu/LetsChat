import { Button } from "../input/index.js";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext.jsx";

export default function Home() {
    const { storeUser } = useUserContext();
    const navigate = useNavigate();

    const handleChat = () => {
        if (!storeUser) {
            navigate("/signup");
        } else {
            navigate("/chatArea");
        }
    };

    return (
        <div>
            <div>
                <h2 className="text-darkBrown text-3xl font-semibold font mt-20 mb-5">
                    Chat with your friends
                </h2>
                <h3 className="text-darkBrown text-xl font-semibold font mb-3">
                    Chat now !
                </h3>
            </div>
            <Button className="myButton" onClick={handleChat}>
                Chat
            </Button>
        </div>
    );
}
