const socket=io();

const sensor=document.getElementById("sensor");

const slider=document.getElementById("led");

const ledvalue=document.getElementById("ledvalue");

socket.on("telemetry",(data)=>{

sensor.innerHTML=data.sensor;

});

slider.addEventListener("input",async()=>{

ledvalue.innerHTML=slider.value;

await fetch("/command",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

led:Number(slider.value)

})

});

});