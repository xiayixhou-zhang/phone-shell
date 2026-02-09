// ====== storage keys ======
const KEY_CHAT = "wx_chat_v2";
const KEY_NAME = "wx_name";
const KEY_REMARK = "wx_remark";
const KEY_BG = "wx_bg_img";

function loadChat(){
  try { return JSON.parse(localStorage.getItem(KEY_CHAT) || "[]"); }
  catch { return []; }
}
function saveChat(list){ localStorage.setItem(KEY_CHAT, JSON.stringify(list)); }

function uid(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }

function fileToDataURL(file){
  return new Promise((resolve, reject)=>{
    const fr = new FileReader();
    fr.onload = ()=> resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

function applyTopText(){
  const nameEl = document.getElementById("wxName");
  const remarkEl = document.getElementById("wxRemark");
  if(nameEl) nameEl.textContent = localStorage.getItem(KEY_NAME) || "眠眠";
  if(remarkEl) remarkEl.textContent = localStorage.getItem(KEY_REMARK) || "个性签名：在呢";
}

function applyBg(){
  const chat = document.getElementById("chat");
  if(!chat) return;
  const bg = localStorage.getItem(KEY_BG);
  chat.style.backgroundImage = bg ? `url(${bg})` : "";
}

function renderChat(){
  const chat = document.getElementById("chat");
  if(!chat) return;

  applyBg();
  chat.innerHTML = "";

  const list = loadChat();
  for(const msg of list){
    const row = document.createElement("div");
    row.className = "msg-row " + (msg.side === "right" ? "right" : "left");

    if(msg.side === "left"){
      const av = document.createElement("div");
      av.className = "avatar";
      row.appendChild(av);
    }else{
      const av = document.createElement("div");
      av.className = "avatar";
      row.appendChild(av);
    }

    const bubble = document.createElement("div");
    bubble.className = "bubble " + (msg.side === "right" ? "green" : "white");

    if(msg.type === "image"){
      const im = new Image();
      im.className = "chat-img";
      im.src = msg.content;
      bubble.appendChild(im);
    }else{
      bubble.textContent = msg.content;
      if(msg.typing) bubble.classList.add("typing");
    }

    row.appendChild(bubble);
    chat.appendChild(row);
  }

  chat.scrollTop = chat.scrollHeight;
}

function pushMsg({side, type="text", content, typing=false, id=null}){
  const list = loadChat();
  list.push({ id: id || uid(), ts: Date.now(), side, type, content, typing });
  saveChat(list);
  renderChat();
}

async function callAPI(text){
  // 你现在只需要保证 /api/reply 存在且返回 { reply: "..." }
  const res = await fetch("/api/reply", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ text })
  });
  if(!res.ok) throw new Error("bad response");
  return await res.json();
}

// ====== init ======
applyTopText();
renderChat();

// ====== bindings ======
const btnMore = document.getElementById("btnMore");
const moreSheet = document.getElementById("moreSheet");
const btnPlus = document.getElementById("btnPlus");
const imgPicker = document.getElementById("imgPicker");
const textInput = document.getElementById("textInput");
const btnSend = document.getElementById("btnSend");

const btnEditName = document.getElementById("btnEditName");
const btnEditRemark = document.getElementById("btnEditRemark");
const btnSetBg = document.getElementById("btnSetBg");
const btnClearChat = document.getElementById("btnClearChat");
const bgPicker = document.getElementById("bgPicker");

function openSheet(){ moreSheet?.classList.add("show"); }
function closeSheet(){ moreSheet?.classList.remove("show"); }

btnMore?.addEventListener("click", openSheet);
moreSheet?.addEventListener("click", (e)=>{
  if(e.target?.dataset?.close) closeSheet();
});

// 改名字（备注）
btnEditName?.addEventListener("click", ()=>{
  const cur = localStorage.getItem(KEY_NAME) || "眠眠";
  const v = prompt("给他改备注（显示在顶栏名字）", cur);
  if(v && v.trim()){
    localStorage.setItem(KEY_NAME, v.trim());
    applyTopText();
  }
  closeSheet();
});

// 改个签
btnEditRemark?.addEventListener("click", ()=>{
  const cur = localStorage.getItem(KEY_REMARK) || "个性签名：在呢";
  const v = prompt("编辑个性签名", cur);
  if(v && v.trim()){
    localStorage.setItem(KEY_REMARK, v.trim());
    applyTopText();
  }
  closeSheet();
});

// 设置背景（上传图片）
btnSetBg?.addEventListener("click", ()=>{
  bgPicker?.click();
});

bgPicker?.addEventListener("change", async ()=>{
  const f = bgPicker.files?.[0];
  bgPicker.value = "";
  if(!f) return;
  const dataUrl = await fileToDataURL(f);
  localStorage.setItem(KEY_BG, dataUrl);
  applyBg();
  closeSheet();
});

// 清空聊天
btnClearChat?.addEventListener("click", ()=>{
  if(confirm("确定清空聊天记录吗？")){
    localStorage.removeItem(KEY_CHAT);
    renderChat();
  }
  closeSheet();
});

// 发图片（不走 API）
btnPlus?.addEventListener("click", ()=> imgPicker?.click());
imgPicker?.addEventListener("change", async ()=>{
  const f = imgPicker.files?.[0];
  imgPicker.value = "";
  if(!f) return;
  const dataUrl = await fileToDataURL(f);
  pushMsg({ side:"right", type:"image", content: dataUrl });
});

// 发送文字 -> API -> 回复
async function sendText(){
  const text = (textInput?.value || "").trim();
  if(!text) return;
  textInput.value = "";

  pushMsg({ side:"right", type:"text", content: text });

  const typingId = uid();
  pushMsg({ side:"left", type:"text", content:"…", typing:true, id: typingId });

  try{
    const data = await callAPI(text);
    const list = loadChat().map(m => m.id === typingId ? { ...m, content: data.reply || "（空回复）", typing:false } : m);
    saveChat(list);
    renderChat();
  }catch(e){
    const list = loadChat().map(m => m.id === typingId ? { ...m, content:"连接失败（API 没通或报错）", typing:false } : m);
    saveChat(list);
    renderChat();
  }
}

btnSend?.addEventListener("click", sendText);
textInput?.addEventListener("keydown", (e)=>{
  if(e.key === "Enter") sendText();
  });
// ====== details page bindings (P2) ======
(function(){
  if(document.title !== "聊天详情") return;

  const KEY_AVATAR = "wx_bot_avatar";
  const avatarBotPreview = document.getElementById("avatarBotPreview");
  const btnUploadAvatar = document.getElementById("btnUploadAvatar");
  const avatarPicker = document.getElementById("avatarPicker");

  const btnSearchInPage = document.getElementById("btnSearchInPage");
  const searchModal = document.getElementById("searchModal");
  const searchKey = document.getElementById("searchKey");
  const doSearch = document.getElementById("doSearch");
  const closeSearch = document.getElementById("closeSearch");
  const searchResult = document.getElementById("searchResult");

  const btnBg = document.getElementById("btnBg");
  const bgModal = document.getElementById("bgModal");
  const btnPickBg = document.getElementById("btnPickBg");
  const btnClearBg = document.getElementById("btnClearBg");
  const btnCloseBg = document.getElementById("btnCloseBg");
  const bgPicker = document.getElementById("bgPicker");

  const btnClear = document.getElementById("btnClear");

  // 头像预览
  const savedAvatar = localStorage.getItem(KEY_AVATAR);
  if(avatarBotPreview){
    avatarBotPreview.style.backgroundSize = "cover";
    avatarBotPreview.style.backgroundPosition = "center";
    if(savedAvatar) avatarBotPreview.style.backgroundImage = `url(${savedAvatar})`;
  }

  btnUploadAvatar?.addEventListener("click", ()=> avatarPicker?.click());
  avatarPicker?.addEventListener("change", async ()=>{
    const f = avatarPicker.files?.[0];
    avatarPicker.value = "";
    if(!f) return;
    const dataUrl = await fileToDataURL(f);
    localStorage.setItem(KEY_AVATAR, dataUrl);
    if(avatarBotPreview) avatarBotPreview.style.backgroundImage = `url(${dataUrl})`;
  });

  // 查找
  function openSearch(){ searchModal?.classList.add("show"); if(searchResult) searchResult.innerHTML=""; }
  function closeS(){ searchModal?.classList.remove("show"); }
  btnSearchInPage?.addEventListener("click", openSearch);
  closeSearch?.addEventListener("click", closeS);

  doSearch?.addEventListener("click", ()=>{
    const key = (searchKey?.value || "").trim();
    if(!key) return;
    const list = loadChat();
    const hits = list.filter(m => m.type==="text" && m.content.includes(key));
    if(!searchResult) return;
    if(!hits.length) { searchResult.textContent = "没有找到。"; return; }
    searchResult.innerHTML = hits.slice(-30).map(m =>
      `<div style="padding:6px 0;border-top:1px solid #f0f0f0;">
        <div style="color:#888;font-size:12px;">${m.side==="right"?"我":"他"}</div>
        <div>${escapeHtml(m.content)}</div>
      </div>`
    ).join("");
  });

  // 背景
  function openBg(){ bgModal?.classList.add("show"); }
  function closeBg(){ bgModal?.classList.remove("show"); }
  btnBg?.addEventListener("click", openBg);
  btnCloseBg?.addEventListener("click", closeBg);
  btnPickBg?.addEventListener("click", ()=> bgPicker?.click());

  bgPicker?.addEventListener("change", async ()=>{
    const f = bgPicker.files?.[0];
    bgPicker.value = "";
    if(!f) return;
    const dataUrl = await fileToDataURL(f);
    localStorage.setItem(KEY_BG, dataUrl);
  });

  btnClearBg?.addEventListener("click", ()=>{
    localStorage.removeItem(KEY_BG);
  });

  // 清空
  btnClear?.addEventListener("click", ()=>{
    if(confirm("确定清空聊天记录吗？")){
      localStorage.removeItem(KEY_CHAT);
      alert("已清空。");
    }
  });

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
      }[s]));
  }
})();
