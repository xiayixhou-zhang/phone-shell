// ==========================================
// 1. 初始化：从“硬盘”读取以前的记录
// ==========================================
let chatHistory = JSON.parse(localStorage.getItem('ji_mian_memory')) || [];

// 页面一打开，就把以前存的聊天气泡全部画出来
window.onload = () => {
    chatHistory.forEach(item => {
        const side = item.role === 'user' ? 'right' : 'left';
        // 如果是季眠回的消息，且包含 |||，为了显示美观，这里也拆开画
        if (side === 'left' && item.content.includes('|||')) {
            const segments = item.content.split('|||');
            segments.forEach(seg => {
                if(seg.trim()) renderMessage('left', seg.trim(), './avatar-ai.png');
            });
        } else {
            renderMessage(side, item.content, side === 'right' ? './avatar-user.png' : './avatar-ai.png');
        }
    });
};

// ==========================================
// 2. 发送消息主逻辑
// ==========================================
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message === "") return;

    // A. 先在屏幕上显示你的气泡
    renderMessage('right', message, './avatar-user.png');
    input.value = ''; 

    try {
        // B. 准备请求 API，带上历史记录
        const response = await fetch('https://my-companion-one.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 把当前的话和之前的记忆一起发过去
            body: JSON.stringify({ 
                message: message, 
                history: chatHistory.slice(-40) // 防止“脑载荷”过重报错
            }) 
        });

        if (!response.ok) throw new Error('API 响应失败');
        const data = await response.json();

        if (data.reply) {
            // C. 【核心：存入记忆】
            // 先把你刚才说的话和季眠的回话存进数组
            chatHistory.push({ role: "user", content: message });
            chatHistory.push({ role: "assistant", content: data.reply });
            
            // D. 【核心：存入硬盘】下次点进来记录还在
            localStorage.setItem('ji_mian_memory', JSON.stringify(chatHistory));

            // E. 【核心：微信式连发】拆分 ||| 符号
            const segments = data.reply.split('|||');
            segments.forEach((msg, index) => {
                const trimmedMsg = msg.trim();
                if (trimmedMsg) {
                    // 每一条消息中间停顿一下，显得季眠是在真的打字
                    setTimeout(() => {
                        renderMessage('left', trimmedMsg, './avatar-ai.png');
                    }, index * 1000); // 每条消息间隔1秒
                }
            });
        }
    } catch (error) {
        console.error("API 错误:", error);
        renderMessage('left', "（季眠的大脑突然空白了一下...）", './avatar-ai.png');
    }
}

// ==========================================
// 3. 渲染气泡的通用函数（保持你的样式）
// ==========================================
function renderMessage(side, text, avatarUrl) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

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
