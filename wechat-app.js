// wechat-app.js

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message === "") return;

    // 1. 在屏幕上显示你发的消息 (右侧 msg right)
    renderMessage('right', message, './avatar-user.png'); // 假设你有用户头像
    input.value = ''; 

    try {
        // 2. 这里的网址必须是你那个 API 项目的真实地址
        const response = await fetch('https://my-companion-one.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }) 
        });

        const data = await response.json();

        // 3. 在屏幕上显示 GPT-4.1 的回复 (左侧 msg left)
        if (data.reply) {
            renderMessage('left', data.reply, './avatar-ai.png');
        } else {
            renderMessage('left', "4.1 酱在发呆，没回话...", './avatar-ai.png');
        }
    } catch (error) {
        console.error("连接失败:", error);
        renderMessage('left', "网络有点问题，4.1 酱失联了 T_T", './avatar-ai.png');
    }
}

// 专门负责画微信气泡的函数
function renderMessage(side, text, avatarUrl) {
    const chatBox = document.getElementById('chat-box'); // 对应你 HTML 里的 id="chat-box"
    
    if (!chatBox) {
        console.error("找不到 chat-box 容器！");
        return;
    }

    // 创建微信风格的 HTML 结构
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${side}`; // 这里会变成 "msg left" 或 "msg right"
    
    msgDiv.innerHTML = `
        <div class="avatar"><img src="${avatarUrl}" alt=""></div>
        <div class="bubble">${text}</div>
    `;
    
    chatBox.appendChild(msgDiv);
    
    // 自动滚到最下面
    chatBox.scrollTop = chatBox.scrollHeight;
}
