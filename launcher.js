const {spawn}=require("child_process");

function run(

name,

cmd,

args

){

console.log();

console.log(
"INICIANDO ->",
name
);

const p=

spawn(

cmd,

args,

{

shell:true,

stdio:"inherit"

}

);

p.on(

"close",

(code)=>{

console.log(

name,

"cerrado",

code

);

}

);

return p;

}

//=======================
// SERVER
//=======================

run(

"SERVER",

"node",

[

"server.js"

]

);

//=======================
// NGROK
//=======================

setTimeout(

()=>{

run(

"NGROK",

"C:/Users/abner/ngrok-v3-stable-windows-amd64/ngrok.exe",

[

"http",

"4000"

]

);

},

5000

);

//=======================
// WATCHER
//=======================

setTimeout(

()=>{

run(

"WATCHER",

"node",

[

"scripts/watch-ngrok.js"

]

);

},

15000

);

console.log();

console.log(
"CARGUARDIAN ONLINE"
);