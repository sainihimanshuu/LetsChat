import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const connectToDatabase = async () => {
    try {
        const client = new pg.Client({
            connectionString: `${process.env.DB_URI}`,
        });

        await client.connect();
        const db = drizzle(client);

        console.log("connected to host", client.host);

        return db;
    } catch (error) {
        console.log("error while connecting to db", error);
        process.exit(1);
    }
};

export default connectToDatabase;
