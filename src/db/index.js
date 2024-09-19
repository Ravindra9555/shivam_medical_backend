 import mongoose from "mongoose";
  import {DB_NAME} from "../constants.js";
   const connectDB = async()=>{
    try {
         const res = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
         console.log(`MongoDB Connected: ${res.connection.host , res.connection.name}`);
     // console.log(res)
    } catch (error) {

         console.error(`Error connecting to MongoDB: ${error.message}`);
         // Exit process with failure
         process.exit(1);
 
    }
   }
 export default connectDB;
