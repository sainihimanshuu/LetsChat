import UserList from "./UserList.jsx";
import ChatBox from "./ChatBox.jsx";

export default function ChatArea() {
    return (
        <div className="flex justify-center mt-10">
            <div className="h-96 w-full mx-3 border-4 border-darkBrown flex p-1">
                <div className="h-full w-2/6 ">
                    <UserList />
                </div>
                <div className="h-full w-4/6 border-2 border-gray-600 border-solid">
                    <ChatBox />
                </div>
            </div>
        </div>
    );
}
