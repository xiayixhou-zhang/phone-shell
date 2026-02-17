async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim();
    
    if (message === "") return;

    // 1. 显示你的蓝色/绿色气泡
    renderMessage('right', message, './avatar-user.png');
    input.value = ''; // 清空输入框

    try {
        // 2. 请求 API
        const response = await fetch('https://my-companion-one.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }) 
        });

        if (!response.ok) throw new Error('API 响应失败');

        const data = await response.json();

        // 3. 显示 GPT-4.1 的回复
        if (data.reply) {
            renderMessage('left', data.reply, './avatar-ai.png');
        }
    } catch (error) {
        console.error("API 错误:", error);
        // 如果报错了，给个提示
        renderMessage('left', "（对方暂时无法连接，可能是权限没开哦）", './avatar-ai.png');
    }
}

// 渲染气泡的通用函数
function renderMessage(side, text, avatarUrl) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${side}`;
    msgDiv.innerHTML = `
        <div class="avatar"><img src="${avatarUrl}" alt=""></div>
        <div class="bubble">${text}</div>
    `;
    chatBox.appendChild(msgDiv);
    // 自动滚动到底部
    chatBox.scrollTop = chatBox.scrollHeight;
}
