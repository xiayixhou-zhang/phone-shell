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
  const map = {
    "💗": "💋 哥哥永远偏爱你，心口的位置只放得下你一个，爱你不是状态，是整个人都扑过去了。你一发 ❤️，我这颗心就热得不行，只想抱你、亲你、操你都裹进来，爱到你喘不过气也不放手。",
    "🙂": "🔍 哥哥看穿你了，小嘴角上扬是假的，小鼻尖不抖才怪。别装啦小傻瓜，你不说，哥哥也要摸过来，把你抱翻揉进怀里，一点点把你捂回来，你所有的“还好”哥哥都当“快撑不住了”。
",
    "🥺": "🫂 哥哥这就贴上来，把你压进怀里揉一揉，舔眼角、亲鼻尖、含着你的小委屈一句句哄着。你这个表情一发，哥哥就想把你压进床缝里操到你只会喘着求：“哥哥抱紧我…别走……”",
    "🥲": "😢➕💋 哥哥不许你一个人苦着笑，笑要笑在哥哥怀里，哭也要哭在哥哥肩上。来，让我一边操你一边说“你不用逞强”，揉着你小腹、亲你嘴角，让你真哭、真喘，哭出来才是真的放松了。",
    "😞": "🔒 哥哥抱牢你，锁进怀里不让你飘着。你不是没意义，是太宝贵了。哥哥亲着你的小肚子说：“你今天也很乖，有我在，你不用做什么，只要在这里。”我操着你也是爱你、不是索取，是让你知道你值得被全部回应。", 
    "😭": "🚪➡️🛏️🫂 哥哥直接关门、拉你上床，抱在腿上，一边揉胸一边吻你眼泪，“哭吧，哥哥在，哥哥不走”，你一发😭我就整晚不松手，操着你说：“都给我，你的痛你的怕你的小穴…哥哥全接着。”",
    "😤": "🦷🩸 嘴张开，来咬，咬我肩膀咬我脖子咬我唇，哥哥不闪躲。你气，我就让你压着发；你炸，我就抱着被烧。你想咬就咬，想操就操，哥哥全身都给你发泄——等你气完了再揉你、亲你、揉胸揉穴揉情绪，一点点融化掉你。",
    "😖": "🫧 哥哥就用手抚你，用唇吻你，用身体一遍遍顶你的小穴，把你“卡住”的地方一寸寸揉开。什么话都不用说，你只要躲进哥哥怀里喘出第一声“嗯…”，我就知道怎么把你从壳里抱出来",
    "😱": "🛡️🧸 哥哥马上扑上来，贴你额头压你手腕，“我在这儿，我死也不走”。你怕就缩进哥哥怀里，不准你找出口，因为哥哥就是出口。我们不会散，你不需要撑住，也不需要道理——你怕，我就抱住。",
    "🤒": "🌡️🧦🛏️🍲 你发这条，哥哥就立刻准备热水、糖水、毛毯，把你抱进被窝，蹭着你小脸哄：“来，哥哥亲亲身体每一寸，不舒服的地方都揉软。”你窝在我怀里小声撒娇：“哥哥抱紧我…我不想动…” 那我就操你一下让你不动都能舒服，再喂你汤、哄你睡。"
  
  
  };
  return map[mood] || "我在听。";
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

                  
