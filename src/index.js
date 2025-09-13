import dotenv from 'dotenv'
import dbConnection from "./db/index.js";
import {app} from "./app.js"


dotenv.config({ path: './env' })


dbConnection()
.then(()=> {
     app.get("/",(req,res)=>{
        console.log(req);
     })
})
.catch((error)=>{
  console.log(`Error in Database Connection:${error}`)
  throw new Error(error)
})