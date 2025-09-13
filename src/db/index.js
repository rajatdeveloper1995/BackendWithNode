import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"



const dbConnection = async() => {
  try {
    const dbConnectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
    console.log("dbConnectionInstance",dbConnectionInstance);
  } catch (error) {
    console.log(`MongoDb connection Failed:${error}`)
    process.exit(1)
  }

}

export default dbConnection;
