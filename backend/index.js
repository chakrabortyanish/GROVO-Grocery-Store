import  dotenv from 'dotenv'  
dotenv.config()
import express from "express"
import { dbConnection } from "./db/connection.js";
import { router } from "./routes/User.js";
import cors from "cors"

const app = express();
 
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

dbConnection();

app.use("/user", router);

app.listen(PORT,()=> console.log(`Server started at PORT : ${PORT}`));