const axios=require("axios");

const fs=require("fs");

const path=require("path");

const {execSync}=require("child_process");

async function update(){

try{

console.log(
"Buscando ngrok..."
);

const r=
await axios.get(
"http://127.0.0.1:4040/api/tunnels"
);

const url=
r.data
.tunnels[0]
.public_url;

console.log(
"URL:",
url
);

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

maintenance:
false,

enabled:
true

},

update:{

check:
true

}

};

fs.writeFileSync(

file,

JSON.stringify(

data,

null,

2

)

);

console.log(
"JSON actualizado"
);

execSync(

"git add ."

);

execSync(

'git commit -m "update ngrok"'

);

execSync(

"git push"

);

console.log(
"GitHub actualizado"
);

}

catch(e){

console.log(
e.message
);

}

}

update();