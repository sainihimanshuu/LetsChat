import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from "react-router-dom";
import {
    HomePage,
    LoginPage,
    SignupPage,
    ChatAreaPage,
} from "./pages/index.js";
import { UserContextProvider } from "./context/UserContext.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/chatArea" element={<ChatAreaPage />} />
        </Route>
    )
);

createRoot(document.getElementById("root")).render(
    <UserContextProvider>
        <RouterProvider router={router} />
    </UserContextProvider>
);
