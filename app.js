/**
 * 核心功能：设置面板开关
 */
const getEl = (id) => document.getElementById(id);
const openSettings = () => getEl('settings-modal').style.display = 'block';
const closeSettings = () => getEl('settings-modal').style.display = 'none';

/**
 * 通用：更新页面上所有匹配的图标
 * @param {string} key - app的名称 (如 'wechat')
 * @param {string} data - 图片的 Base64 数据
 */
function updateAllIcons(key, data) {
    // 匹配规则：alt属性、src包含关键字、或者父级class包含关键字
    const selectors = [
        `img[alt="${key}"]`,
        `.app-icon-${key}`,
        `img[src*="${key}"]`
    ];
    document.querySelectorAll(selectors.join(',')).forEach(img => {
        img.src = data;
        // 顺便移除虚线框样式
        if(img.parentElement.classList.contains('icon-wrapper')) {
            img.parentElement.style.border = 'none';
        }
    });
}

/**
 * 监听：文件上传逻辑
 */
// 1. 背景上传
getEl('bg-upload').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = () => {
        document.body.style.background = `url(${reader.result}) center/cover no-repeat fixed`;
        localStorage.setItem('custom-bg', reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

// 2. 图标上传
getEl('icon-upload').onchange = function(e) {
    const appKey = getEl('app-selector').value;
    const reader = new FileReader();
    reader.onload = () => {
        updateAllIcons(appKey, reader.result);
        localStorage.setItem(`icon-${appKey}`, reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

/**
 * 初始化：页面加载时恢复数据
 */
window.addEventListener('DOMContentLoaded', () => {
    // 恢复背景
    const savedBg = localStorage.getItem('custom-bg');
    if (savedBg) document.body.style.background = `url(${savedBg}) center/cover no-repeat fixed`;

    // 恢复所有 App 图标
    const apps = ['wechat', 'health', 'music', 'books', 'home', 'reminders', 'phone', 'camera', 'settings'];
    apps.forEach(app => {
        const data = localStorage.getItem(`icon-${app}`);
        if (data) updateAllIcons(app, data);
    });
});
