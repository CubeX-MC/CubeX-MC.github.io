export interface Project {
  name: string;
  description: string;
  features: string[];
  platforms: string[];
  contributors: string[];
  repository: string;
  links: { label: string; url: string }[];
  icon: string;
}

export const projects: Project[] = [
  {
    name: 'EcoBalancer',
    description: '对不活跃玩家进行经济惩罚的 Minecraft 插件。自动检测并逐步回收长期不上线玩家的经济资产，维持服务器经济系统的健康平衡。',
    features: ['不活跃收税', '可配置税率', '经济平衡'],
    platforms: ['Spigot', 'Paper'],
    contributors: ['angushushu', 'itmn23'],
    repository: 'CubeX-MC/EcoBalancer',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/EcoBalancer' },
    ],
    icon: '💰',
  },
  {
    name: 'Metro',
    description: 'Minecraft 地铁系统插件。轻量级随叫随到的铁路管理，玩家可以快速创建站到站的铁路线路，矿车按需发车。',
    features: ['随叫随到', '站到站直达', '轻量级'],
    platforms: ['Spigot', 'Paper'],
    contributors: ['angushushu', 'LonelyxiyaOVO', 'ALingqing', 'eunalice'],
    repository: 'CubeX-MC/Metro',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Metro' },
    ],
    icon: '🚇',
  },
  {
    name: 'Railway',
    description: '基于 Metro 扩展的列车管理系统，支持多矿车编组和定时发车功能，适合构建大型铁路网络。',
    features: ['多矿车编组', '定时发车', '线路规划'],
    platforms: ['Spigot', 'Paper'],
    contributors: ['angushushu', 'LonelyxiyaOVO', 'ALingqing', 'eunalice'],
    repository: 'CubeX-MC/Railway',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Railway' },
    ],
    icon: '🚂',
  },
  {
    name: 'RuleGems',
    description: '实验性的服务器管理插件。将权力和权限实例化为宝石，玩家可以获取、争夺和交易宝石。是 Gemocracy 玩家自治服的核心基础。',
    features: ['权限宝石化', '玩家争夺', '自由交易'],
    platforms: ['Spigot', 'Paper'],
    contributors: ['angushushu', 'FZAoao'],
    repository: 'CubeX-MC/RuleGems',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/RuleGems' },
    ],
    icon: '💎',
  },
  {
    name: 'FAWEReplace',
    description: '基于 FastAsyncWorldEdit 的高效方块替换插件，适用于全地图范围的批量方块替换操作。',
    features: ['高性能替换', '全地图扫描', 'FAWE 集成'],
    platforms: ['Spigot', 'Paper'],
    contributors: ['angushushu', 'Cong0707'],
    repository: 'CubeX-MC/FAWEReplace',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/FAWEReplace' },
    ],
    icon: '🔧',
  },
  {
    name: 'Hooked',
    description: '木筏求生风格的漂浮物收集系统。玩家在海洋中用钓鱼竿钩取漂流资源，获得生存物资，并支持多人归属、动态漂流和丰富配置。',
    features: ['漂浮物生成', '真实钩取手感', '事件 API'],
    platforms: ['Paper 1.21+', 'Folia'],
    contributors: ['AdLamb'],
    repository: 'AdLambXD/Hooked',
    links: [
      { label: 'GitHub', url: 'https://github.com/AdLambXD/Hooked' },
    ],
    icon: '🎣',
  },
  {
    name: 'WebMC',
    description: '将 Minecraft 1.21.8 客户端通过 TeaVM 编译到浏览器运行的 WebGL 2 项目，目标是在网页端运行可验收的 Minecraft 客户端体验。',
    features: ['浏览器运行', 'TeaVM 编译', 'WebGL 2 渲染'],
    platforms: ['Web', 'Minecraft 1.21.8'],
    contributors: ['addxiaoyi'],
    repository: 'Steve3184/WebMC',
    links: [
      { label: 'GitHub', url: 'https://github.com/Steve3184/WebMC' },
    ],
    icon: '🌐',
  },
  {
    name: 'CubeXSLG',
    description: 'Minecraft Paper 与 Folia 的策略模拟经营插件。玩家可以创建城镇、管理虚拟仓库、建造升级建筑、研究科技、招募居民并抵御入侵。',
    features: ['城镇经营', '虚拟仓库', '科技树'],
    platforms: ['Paper 1.21.8', 'Folia'],
    contributors: ['FallenCrystal', 'AdLambXD'],
    repository: 'CubeX-MC/CubeXSLG',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/CubeXSLG' },
    ],
    icon: '🏰',
  },
  {
    name: 'Contract',
    description: '玩家对玩家合同平台，支持委托、对赌和合作三类合同。围绕 Vault 托管资金、接单、提交、确认、裁决、取消退款和管理员仲裁构建完整流程。',
    features: ['合同工作台', 'Vault 托管', '仲裁流程'],
    platforms: ['Spigot', 'Paper', 'Vault'],
    contributors: ['angushushu'],
    repository: 'CubeX-MC/Contract',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Contract' },
    ],
    icon: '📜',
  },
  {
    name: 'MountLicense',
    description: '载具牌照插件。把马、驴、骡、骆驼、船和矿车注册为玩家的私有交通资产，并提供所有权保护、停车、召回、钥匙和信任名单管理。',
    features: ['载具注册', '停车保护', '钥匙召回'],
    platforms: ['Spigot 1.18+', 'Paper', 'Vault'],
    contributors: ['angushushu'],
    repository: 'CubeX-MC/MountLicense',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/MountLicense' },
    ],
    icon: '🐎',
  },
  {
    name: 'BookLite',
    description: '面向 Paper 与 Spigot 的轻量化成书存储插件。将成书正文保存到本地 SQLite 数据库，物品只保留极小标记，支持阅读、复制、审查、软删除和卸载恢复。',
    features: ['SQLite 存储', '内容去重', '卸载恢复'],
    platforms: ['Spigot', 'Paper', 'SQLite'],
    contributors: ['angushushu'],
    repository: 'CubeX-MC/BookLite',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/BookLite' },
    ],
    icon: '📚',
  },
  {
    name: 'Clarity',
    description: '清理被移除插件遗留数据的服务器维护工具。可扫描和清除玩家状态、物品元数据、属性与效果等残留，帮助服务器迁移或卸载插件后保持干净。',
    features: ['玩家状态扫描', '物品元数据清理', '插件残留处理'],
    platforms: ['Paper 1.21', 'Bukkit'],
    contributors: ['angushushu'],
    repository: 'CubeX-MC/Clarity',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Clarity' },
    ],
    icon: '🧹',
  },
];
