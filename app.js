const getEl = (id) => document.getElementById(id);
const openSettings = () => getEl('settings-modal').style.display = 'block';
const closeSettings = () => getEl('settings-modal').style.display = 'none';

// 通用更新函数
function updateIcons(key, data) {
    document.querySelectorAll(`img[alt="${key}"]`).forEach(img => {
        img.src = data;
        if(img.parentElement.classList.contains('icon-wrapper')) img.parentElement.style.border = 'none';
    });
}

// 监听上传
getEl('bg-upload').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
        document.body.style.background = `url(${reader.result}) center/cover no-repeat fixed`;
        localStorage.setItem('custom-bg', reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

getEl('widget-upload').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
        getEl('weather-img').src = reader.result;
        localStorage.setItem('custom-widget', reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

getEl('icon-upload').onchange = (e) => {
    const key = getEl('app-selector').value;
    const reader = new FileReader();
    reader.onload = () => {
        updateIcons(key, reader.result);
        localStorage.setItem(`icon-${key}`, reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

// 初始化恢复
window.onload = () => {
    const bg = localStorage.getItem('custom-bg');
    if(bg) document.body.style.background = `url(${bg}) center/cover no-repeat fixed`;

    const widget = localStorage.getItem('custom-widget');
    if(widget) getEl('weather-img').src = widget;

    ['wechat', 'health', 'music', 'books', 'home', 'reminders', 'phone', 'camera', 'settings'].forEach(app => {
        const data = localStorage.getItem(`icon-${app}`);
        if(data) updateIcons(app, data);
    });
};
