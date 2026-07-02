const express=require("express");
const http=require("http");
const {Server}=require("socket.io");

const app=express();

const server=http.createServer(app);

const io=new Server(server);

app.use(express.json());

app.use(express.static("public"));

let state={
sensor:0,
led:0
};

app.post("/telemetry",(req,res)=>{

state.sensor=req.body.sensor;

io.emit("telemetry",state);

res.send({ok:true});

});

app.post("/command",(req,res)=>{

state.led=req.body.led;

io.emit("command",state);

res.send(state);

});

app.get("/status",(req,res)=>{

res.send(state);

});

io.on("connection",()=>{

console.log("dashboard conectado");

});

server.listen(4000,()=>{

console.log("Servidor puerto 4000");

});