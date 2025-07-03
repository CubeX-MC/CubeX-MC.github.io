// js/script.js
// 获取服务器状态 mcstatus.io API
async function fetchServerStatus(server) {
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${server.ip}`);
        const data = await response.json();

        // 调试信息
        console.log(`Server Data for ${server.name}:`, data);

        // 获取状态元素
        const statusElement = document.getElementById(`status-${server.id}`);
        const onlinePlayersElement = document.getElementById(`online-players-${server.id}`);
        const maxPlayersElement = document.getElementById(`max-players-${server.id}`);
        const serverVersionElement = document.getElementById(`server-version-${server.id}`);

        // 更新状态
        if (data.online) {
            statusElement.textContent = '在线🟢';
            statusElement.classList.add('status-online');
            statusElement.classList.remove('status-offline');
        } else {
            statusElement.textContent = '离线🔴';
            statusElement.classList.add('status-offline');
            statusElement.classList.remove('status-online');
        }

        // 更新在线玩家数
        onlinePlayersElement.textContent = data.players ? data.players.online : 0;

        // 更新最大玩家数
        maxPlayersElement.textContent = data.players ? data.players.max : 20;

        // 更新服务器版本
        if (typeof data.version === 'string') {
            serverVersionElement.textContent = data.version;
        } else if (data.version && data.version.name) {
            serverVersionElement.textContent = data.version.name;
        } else if (data.version) {
            serverVersionElement.textContent = '版本信息不完整';
            console.warn(`版本信息不完整 for ${server.name}:`, data.version);
        } else {
            serverVersionElement.textContent = '版本信息不可用';
            console.warn(`版本信息不可用 for ${server.name}`);
        }

    } catch (error) {
        console.error(`获取 ${server.name} 状态失败:`, error);
        const statusElement = document.getElementById(`status-${server.id}`);
        statusElement.textContent = '离线🔴';
        statusElement.classList.add('status-offline');
        statusElement.classList.remove('status-online');
        serverVersionElement.textContent = '加载失败';
    }
}

// 页面加载后自动刷新状态
document.addEventListener('DOMContentLoaded', () => {
    const servers = [
        { id: 'main', ip: 'play.cubexmc.top', name: '主服务器' },
        { id: 'nostalgia', ip: 'old.cubexmc.org', name: '怀旧服' }
    ];

    servers.forEach(server => {
        fetchServerStatus(server);
        setInterval(() => fetchServerStatus(server), 600000); // 每10分钟刷新一次
    });
});
