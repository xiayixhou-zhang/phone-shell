// wechat-app.js 完整代码

// 1. 发送消息的主函数
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message === "") return;

    // 先把你的话显示在微信界面上
    renderMessage('user', message);
    input.value = ''; // 清空输入框

    try {
        // 【关键】拨号给你的 API 项目
        const response = await fetch('https://my-companion-one.vercel.app/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }) // 传给 4.1 的话
        });

        const data = await response.json();

        // 把 GPT-4.1 的回复显示出来
        if (data.reply) {
            renderMessage('ai', data.reply);
        } else {
            renderMessage('ai', "对方不想理你，并向你投掷了一个错误。");
        }
    } catch (error) {
        console.error("连接失败:", error);
        renderMessage('ai', "网络炸了，没连上 GPT-4.1...");
    }
}

// 2. 负责把气泡渲染到屏幕上的函数 (你需要根据你的 HTML 结构微调)
function renderMessage(role, text) {
    const chatContainer = document.querySelector('.chat-content'); // 假设你的聊天容器类名是这个
    if(!chatContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`; // 区分是人还是AI
    msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
    
    chatContainer.appendChild(msgDiv);
    
    // 自动滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
