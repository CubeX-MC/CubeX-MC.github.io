export type ProjectGroup = 'plugin' | 'letseries' | 'platform';

export interface ProjectGroupMeta {
  id: ProjectGroup;
  title: string;
  kicker: string;
  description: string;
}

/** Display order of the project sections. */
export const projectGroups: ProjectGroupMeta[] = [
  {
    id: 'plugin',
    title: '服务器插件',
    kicker: 'Server Plugins',
    description: '直接服务于 CubeX 研究院服务器运营的插件，从经济、交通、合同到内容存储。',
  },
  {
    id: 'letseries',
    title: 'LetMe 系列',
    kicker: 'LetSeries',
    description: 'LetSeries Team 维护的 LetMe 系列插件，单独托管在 LetSeries 组织下，与 CubeX 共享开发者。',
  },
  {
    id: 'platform',
    title: '工具与平台',
    kicker: 'Tools & Platform',
    description: '服务器之外的基础设施：线路调度、运营后台和跨平台客户端实验。',
  },
];

export interface Project {
  name: string;
  group: ProjectGroup;
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
    group: 'plugin',
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
    group: 'plugin',
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
    group: 'plugin',
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
    group: 'plugin',
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
    group: 'plugin',
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
    group: 'plugin',
    description: '木筏求生风格的漂浮物收集系统。玩家在海洋中用钓鱼竿钩取漂流资源，获得生存物资，并支持多人归属、动态漂流和丰富配置。',
    features: ['漂浮物生成', '真实钩取手感', '事件 API'],
    platforms: ['Paper 1.21+', 'Folia'],
    contributors: ['Adlamb'],
    repository: 'AdLambXD/Hooked',
    links: [
      { label: 'GitHub', url: 'https://github.com/AdLambXD/Hooked' },
    ],
    icon: '🎣',
  },
  {
    name: 'WebMC',
    group: 'platform',
    description: '将 Minecraft 1.21.8 客户端通过 TeaVM 编译到浏览器运行的 WebGL 2 项目，目标是在网页端运行可验收的 Minecraft 客户端体验。',
    features: ['浏览器运行', 'TeaVM 编译', 'WebGL 2 渲染'],
    platforms: ['Web', 'Minecraft 1.21.8'],
    contributors: ['addxiaoyi', 'Steve3184'],
    repository: 'Steve3184/WebMC',
    links: [
      { label: 'GitHub', url: 'https://github.com/Steve3184/WebMC' },
    ],
    icon: '🌐',
  },
  {
    name: 'CubeXSLG',
    group: 'plugin',
    description: 'Minecraft Paper 与 Folia 的策略模拟经营插件。玩家可以创建城镇、管理虚拟仓库、建造升级建筑、研究科技、招募居民并抵御入侵。',
    features: ['城镇经营', '虚拟仓库', '科技树'],
    platforms: ['Paper 1.21.8', 'Folia'],
    contributors: ['FallenCrystal', 'Adlamb'],
    repository: 'CubeX-MC/CubeXSLG',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/CubeXSLG' },
    ],
    icon: '🏰',
  },
  {
    name: 'Contract',
    group: 'plugin',
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
    group: 'plugin',
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
    group: 'plugin',
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
    group: 'plugin',
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
  {
    name: 'Polls',
    group: 'plugin',
    description: '游戏内民意投票插件。玩家可通过 GUI 发起议题并参与一人一票的表决，管理员可编辑议题和截止时间，投票数据由 SQLite 持久化保存。',
    features: ['GUI 投票', '一人一票', 'SQLite 持久化'],
    platforms: ['Bukkit 1.21.4+', 'Spigot', 'Paper', 'Folia'],
    contributors: ['FZAoao'],
    repository: 'CubeX-MC/Polls',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Polls' },
    ],
    icon: '🗳️',
  },
  {
    name: 'Regions',
    group: 'plugin',
    description: '可发布场地与小游戏框架。外部领地插件负责"哪里是区域、谁拥有区域"，Regions 负责"这个区域在服务器规则里变成什么场地"——把 Lands、Cuboid 统一成可配置的 Region，再由 RuleGems 的统治者为其安装玩法、规则、效果和 IF/THEN 行为。',
    features: ['带 revision 的发布流程', 'Flag / Effect / Trigger', '战斗 · 赛跑 · 捉迷藏'],
    platforms: ['Paper 1.21.11', 'Folia', 'Java 21'],
    contributors: ['angushushu'],
    repository: 'CubeX-MC/Regions',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Regions' },
    ],
    icon: '🏟️',
  },
  {
    name: 'PlayMusic',
    group: 'plugin',
    description: '音乐播放插件与配套 Mod。支持网易云搜索点歌、实时歌词、私人 FM 和 B 站音频；装了 Mod 的玩家用原生面板控制，没装的也能用箱子 GUI 操作同一套播放队列。',
    features: ['网易云点歌', '实时歌词', '客户端音频流'],
    platforms: ['Paper 1.18.2+', 'Folia', 'Java 21'],
    contributors: ['FZAoao'],
    repository: 'CubeX-MC/PlayMusic',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/PlayMusic' },
    ],
    icon: '🎵',
  },
  {
    name: 'NETTOFRP',
    group: 'platform',
    description: 'Minecraft 服务器 FRP 线路的智能选路入口。把多条独立线路合并成单一的 auto 入口，后台持续探测各线路的延迟、抖动、成功率和带宽，综合打分后为每个新连接导向当前最优线路。',
    features: ['线路质量探测', '自动选路', 'Transfer / TCP 透传'],
    platforms: ['Go', '独立服务'],
    contributors: ['FZAoao'],
    repository: 'CubeX-MC/NETTOFRP',
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/NETTOFRP' },
    ],
    icon: '🛰️',
  },
  {
    name: 'LetMeDo',
    group: 'letseries',
    description: 'LetSeries 的多功能主插件，单个 jar 覆盖几乎所有版本与服务端。多模块 Gradle 工程拆成 api / core / bukkit / velocity / bungee，以 Paper 1.21 API 编译、只通过反射调用新版本方法并优雅降级，因此能从 1.8.8 一路启动到最新版。',
    features: ['跨平台抽象层', '模块化加载', '1.8.8+ 兼容'],
    platforms: ['Paper', 'Folia', 'Velocity', 'BungeeCord'],
    contributors: ['FZAoao'],
    repository: 'LetSeries/LetMeDo',
    links: [
      { label: 'GitHub', url: 'https://github.com/LetSeries/LetMeDo' },
    ],
    icon: '🧰',
  },
  {
    name: 'LetMeAsk',
    group: 'letseries',
    description: '服务器抢答活动插件。按配置间隔自动在聊天栏出题，玩家抢答获得金币奖励，答案支持可配置容错的模糊匹配；答题过快或连续答对过多时会触发人机验证。',
    features: ['定时出题', '模糊匹配', 'Vault 经济'],
    platforms: ['Paper 1.20.4+', 'Spigot', 'Vault'],
    contributors: ['FZAoao', 'kevin-steve772'],
    repository: 'LetSeries/LetMeAsk',
    links: [
      { label: 'GitHub', url: 'https://github.com/LetSeries/LetMeAsk' },
    ],
    icon: '❓',
  },
  {
    name: 'LetMeSee',
    group: 'letseries',
    description: '轻量级只读容器查看插件。管理员用指令以只读模式打开任意坐标的箱子、木桶、潜影盒和熔炉，直接读取方块数据，绕过 Lands、QuickShop 等保护插件的限制。',
    features: ['只读查看', '绕过保护插件', 'Folia 区域调度'],
    platforms: ['Folia', 'Paper', 'Java 21'],
    contributors: ['kevin-steve772', 'FZAoao'],
    repository: 'LetSeries/LetMeSee',
    links: [
      { label: 'GitHub', url: 'https://github.com/LetSeries/LetMeSee' },
    ],
    icon: '🔍',
  },
];
