import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error("PLease define mogodb uri in the .env.development or .env.production")
}

const connectToDatabase = async() => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`connected to mongo db in ${NODE_ENV} mode`);
        
    }
    catch(error) {
        console.log('Error connecting to mongo db', error);
    }
}

export default connectToDatabase;