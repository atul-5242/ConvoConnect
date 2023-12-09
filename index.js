const express = require("express");
const app = express();

// const userRoute = require("./routes/User");

const database = require("./server/config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

// dataBase Connection.
database.connect();
// middlewares addition:
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,//Seach about It HW
    })
)


// routes mounting:
// app.use("/api/v1/auth",userRoute)

// default route:
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is Up and Running..."
    })
})

app.listen(PORT,()=>{
    console.log(`App is running at : ${PORT}`);
});