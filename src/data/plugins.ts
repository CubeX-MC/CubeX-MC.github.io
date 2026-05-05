export interface Plugin {
  name: string;
  description: string;
  features: string[];
  platforms: string[];
  links: { label: string; url: string }[];
  icon: string;
}

export const plugins: Plugin[] = [
  {
    name: 'EcoBalancer',
    description: '对不活跃玩家进行经济惩罚的插件。自动检测并逐步回收长期不上线玩家的经济资产，维持服务器经济系统的健康平衡。',
    features: ['不活跃收税', '可配置税率', '经济平衡'],
    platforms: ['Spigot', 'Paper'],
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
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/Railway' },
    ],
    icon: '🚂',
  },
  {
    name: 'RuleGems',
    description: '实验性的服务器管理插件。将权力和权限实例化为宝石（Gems），玩家可以获取、争夺和交易宝石。是 Gemocracy 玩家自治服的核心基础。',
    features: ['权限宝石化', '玩家争夺', '自由交易'],
    platforms: ['Spigot', 'Paper'],
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
    links: [
      { label: 'GitHub', url: 'https://github.com/CubeX-MC/FAWEReplace' },
    ],
    icon: '🔧',
  },
];
