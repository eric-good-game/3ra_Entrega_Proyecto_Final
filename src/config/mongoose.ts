import mongoose from "mongoose";
import logger from "./logger";

export const uri = process.env.MONGODB_URI || "mongodb+srv://coderhouse:%405PmAPWakmq%40GHx@coderhouse.q5mhnd3.mongodb.net/coderhouse-project?retryWrites=true&w=majority";

async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        logger.info('Connected to database');
    } catch (error) {
        logger.error('Error connecting to database', error);
    }
}

connectToDatabase();