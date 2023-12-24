import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser";
import router from "./router";
import Config from "./config";
import history from 'connect-history-api-fallback'

const port = Number(8899);
const app = express();


// 设置body parser中间件
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(router)
app.use(history);

mongoose
    .connect(Config.uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Could not connect to MongoDB...", err));

app.listen(port,function(){
    console.log(`${port + "app express is running..."}`)
})