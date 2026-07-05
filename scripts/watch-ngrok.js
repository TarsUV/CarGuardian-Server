const axios=require("axios");

const fs=require("fs");

const path=require("path");

const {execSync}=require("child_process");

let last="";

async function update(){

try{

const r=

await axios.get(

"http://127.0.0.1:4040/api/tunnels"

);

const tunnel=

r.data.tunnels.find(

t=>

t.public_url.startsWith(

"https"

)

);

if(!tunnel){

console.log(
"No hay tunel"
);

return;

}

const url=

tunnel.public_url;

if(

url===last

){

return;

}

console.log();

console.log(
"URL nueva:"
);

console.log(
url
);

last=url;

const file=

path.join(

"C:/Users/abner/TarsUV.github.io",

"config",

"server.json"

);

const data={

project:

"CarGuardian Analytics",

server:{

url,

protocol:

"https",

backend_port:

4000,

updated_at:

new Date()

.toISOString()

},

discovery:{

refresh_hours:

24,

retry_minutes:

10

},

status:{

maintenance:false,

enabled:true

},

update:{

check:true

}

};

fs.writeFileSync(

file,

JSON.stringify(

data,

null,

2)

);

execSync(

"git add .",

{

cwd:

"C:/Users/abner/TarsUV.github.io"

}

);

try{

execSync(

'git commit -m "ngrok auto update"',

{

cwd:

"C:/Users/abner/TarsUV.github.io"

}

);

}catch{}

execSync(

"git push",

{

cwd:

"C:/Users/abner/TarsUV.github.io"

}

);

console.log(
"GitHub actualizado"
);

}

catch(e){

console.log(

"Esperando ngrok..."

);

}

}

console.log(
"Watcher iniciado"
);

setInterval(

update,

15000

);