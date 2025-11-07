import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express()
// FOR CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ,
  credentials: true
}))

// REQUEST IS COMING IN JSON FORMAT, INITILIAZE IT TO USE IT
app.use(express.json({limit:"16kb"}));


// REQUEST IS COMING FROM URL, INITILIAZE IT TO USE IT
app.use(express.urlencoded({extended:true , limit:"16kb"}));

// IN REQUEST IF ANY IMAGE OR FAVIRICON THEN STORE IN OUR PUBLIC FOLDER , INITILIAZE IT TO USE IT
app.use(express.static("public"));

// FOR COOKIES HANDLER, INITILIAZE IT TO USE IT
app.use(cookieParser());



// ROUTES DECLARATION
import { router } from "./routes/user.routes.js";

app.use("/api/v1/user",router)



app.listen(process.env.PORT || 8000 , () => {
  console.log(`App is running in ${process.env.PORT}`)
})




export {app}