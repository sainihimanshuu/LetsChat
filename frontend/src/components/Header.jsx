import { useNavigate } from "react-router-dom";
import { Button } from "../components/input/index.js";

export default function Header() {
    const navigate = useNavigate();
    return (
        <div className="h-20 p-4 flex justify-end items-center shadow-lg">
            <div className="flex justify-between items-center"></div>
            <Button className="myButton" onClick={() => navigate("/login")}>
                Login
            </Button>
            <Button className="myButton" onClick={() => navigate("/signup")}>
                Signup
            </Button>
        </div>
    );
}
