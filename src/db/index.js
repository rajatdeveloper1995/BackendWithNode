import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const dbConnection = async () => {
  try {
    const conectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${DB_NAME}`
    );
    // console.log("MongoDB Connected:", conectionInstance.connection.host);
  } catch (error) {
    console.log("Mongo DB Connection Failed:", error);
    process.exit(1);
  }
};

export default dbConnection;
