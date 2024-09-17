 import express  from  'express';
 import cors from "cors";
 import cookieParser from 'cookie-parser';
import { ApiResponse } from './utils/ApiResponse.js';
 
 const app = express();
 app.use(express.static("dist"));

 app.use(cors());
 app.use(cookieParser());

 app.use(express.json({
    limit:'20kb',
 }))

 app.use(express.urlencoded({
    extended: true,
    limit:'20kb',
 }))

 app.use(express.static("public"));

app.get("/",(req, res) => {
    res.json( new ApiResponse(200, "success", "Api is working fine "));
})





 export {app};
