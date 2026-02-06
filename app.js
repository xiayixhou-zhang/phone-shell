function pad(n){return String(n).padStart(2,"0")}
function setTime(){
  const d = new Date();
  const t = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const el = document.getElementById("time");
  if(el) el.textContent = t;
}
setTime();
setInterval(setTime, 1000 * 15);

const moodEl = document.getElementById("mood");
const btnMood = document.getElementById("btn-mood");
if(btnMood && moodEl){
  btnMood.addEventListener("click", ()=>{
    const arr = ["🩷","💛","💙","🩶","✨","🫧"];
    const pick = arr[Math.floor(Math.random()*arr.length)];
    moodEl.textContent = `今天心情：${pick}`;
  });
}

const send = document.getElementById("send");
const input = document.getElementById("input");
if(send && input){
  send.addEventListener("click", ()=>{
    const text = input.value.trim();
    if(!text) return;
    const wrap = document.querySelector(".screen.chat");
    const me = document.createElement("div");
    me.className = "msg me";
    me.textContent = text;
    wrap.insertBefore(me, wrap.querySelector(".composer"));
    input.value = "";
  });
}
