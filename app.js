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
    const chat = $("chat");
    const me = document.createElement("div");
    me.className = "msg me";
    me.textContent = text;
    wrap.insertBefore(me, wrap.querySelector(".composer"));
    input.value = "";
  });
}
// ====== WeChat simple logic (no backend) ======
const $ = (id) => document.getElementById(id);

const state = {
  mood: localStorage.getItem("mood") || "💗",
  bg: localStorage.getItem("bg") || "pink",
  remark: localStorage.getItem("remark") || "眠眠",
  sign: localStorage.getItem("sign") || "个性签名：在呢",
  meAvatar: localStorage.getItem("meAvatar") || "https://i.pravatar.cc/80?img=15",
  botAvatar: localStorage.getItem("botAvatar") || "https://i.pravatar.cc/80?img=32",
};

function applyUI(){
  const chat = $("chat");
  if(chat){
    chat.classList.remove("bg-pink","bg-wechat","bg-night");
    chat.classList.add(`bg-${state.bg}`);
  }
  if($("wx-remark")) $("wx-remark").textContent = state.remark;
  if($("wx-sign")) $("wx-sign").textContent = state.sign;
  if($("botAvatar")) $("botAvatar").src = state.botAvatar;
}

function pushMsg(text, side){
  const chat = $("chat");
  if(!chat) return;

  const row = document.createElement("div");
  row.className = `msg-row ${side}`;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.alt = side === "right" ? "我" : "他";
  avatar.src = side === "right" ? state.meAvatar : state.botAvatar;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${side === "right" ? "green" : "white"}`;
  bubble.textContent = text;

  row.appendChild(avatar);
  row.appendChild(bubble);
  chat.appendChild(row);

  chat.scrollTop = chat.scrollHeight;
}

function botReplyForMood(mood){
  return "我在听。";
}

function wireWechat(){
  if(!$("chat")) return;

  applyUI();
  pushMsg(`今天心情：${state.mood}`, "left");

  // 发送
  const send = () => {
    const input = $("input");
    const text = (input.value || "").trim();
    if(!text) return;
    pushMsg(text, "right");
    input.value = "";

    // 假回应：更像“他在陪你聊”
    setTimeout(() => {
      pushMsg("我看到了。你说的我都记着。", "left");
    }, 350);
  };

  $("send")?.addEventListener("click", send);
  $("input")?.addEventListener("keydown", (e) => {
    if(e.key === "Enter") send();
  });

  // 状态弹层
  // 状态弹层（强制显示/隐藏，不靠 CSS）
$("btnStatus")?.addEventListener("click", () => {
  const m = $("statusModal");
  if (!m) return;
  m.style.display = "flex";
  m.classList.add("show");
});

$("closeModal")?.addEventListener("click", () => {
  const m = $("statusModal");
  if (!m) return;
  m.style.display = "none";
  m.classList.remove("show");
});

$("statusModal")?.addEventListener("click", (e) => {
  const m = $("statusModal");
  if (!m) return;
  if (e.target === m) {
    m.style.display = "none";
    m.classList.remove("show");
  }
});

  // 选心情 + 选背景
  document.querySelectorAll(".mood[data-mood]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.mood = btn.dataset.mood;
      localStorage.setItem("mood", state.mood);
      pushMsg(`我把状态换成了：${state.mood}`, "right");
      setTimeout(()=> pushMsg(botReplyForMood(state.mood), "left"), 300);
    });
  });

  document.querySelectorAll(".mood[data-bg]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.bg = btn.dataset.bg;
      localStorage.setItem("bg", state.bg);
      applyUI();
      pushMsg(`背景换好了：${btn.textContent}`, "right");
      });
  });
}

wireWechat();
applyUI();

                  
