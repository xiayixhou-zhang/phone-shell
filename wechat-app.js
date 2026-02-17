// 第一步：脚本加载检查
alert("1. 脚本加载成功！看到这个说明 HTML 找到了 js 文件");

async function sendMessage() {
    alert("2. 你点击了发送按钮！");

    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    
    if (!input || !chatBox) {
        alert("错误：没找到输入框或聊天框，请检查 HTML 里的 ID 是不是叫 user-input 和 chat-box");
        return;
    }

    const message = input.value.trim();
    if (message === "") return;

    // 第二步：尝试在屏幕上画出你的气泡
    alert("3. 准备显示你的消息: " + message);
    
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'msg right';
    userMsgDiv.innerHTML = `
        <div class="avatar"><img src="./avatar-user.png" alt=""></div>
        <div class="bubble">${message}</div>
    `;
    chatBox.appendChild(userMsgDiv);
    
    input.value = ''; // 清空输入框
    chatBox.scrollTop = chatBox.scrollHeight;

    // 第三步：尝试联系 API
    alert("4. 准备去呼叫 4.1 酱...");

    try {
        const response = await fetch('https://my-companion-one.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        alert("5. API 响应了！内容是: " + JSON.stringify(data));

        if (data.reply) {
            const aiMsgDiv = document.createElement('div');
            aiMsgDiv.className = 'msg left';
            aiMsgDiv.innerHTML = `
                <div class="avatar"><img src="./avatar-ai.png" alt=""></div>
                <div class="bubble">${data.reply}</div>
            `;
            chatBox.appendChild(aiMsgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    } catch (error) {
        alert("报错了： " + error);
    }
}
