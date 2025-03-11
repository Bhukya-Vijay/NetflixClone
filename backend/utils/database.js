import mongoose from "mongoose";
// import dotenv from 'dotenv'
import { ENV_VARS } from "../config/envVars.js";



/* dotenv.config({
    path: '../.env'
}) */


const databaseConnection = async () => {

    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("MongoDb connected: " + conn.connection.host)
    } catch (error) {
        console.log("Error Connecting to MONOGODB: " + error.message)
        process.exit(1);
    }
}

export default databaseConnection;

