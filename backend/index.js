import connectToDatabase from "./src/db/index.js";
import { httpServer } from "./src/socket/socket.js";

const PORT = process.env.PORT;

export const db = await connectToDatabase();

httpServer.listen(PORT, () => {
    console.log("listening to port", PORT);
});
