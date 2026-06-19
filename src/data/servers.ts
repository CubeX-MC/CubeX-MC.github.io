export interface Server {
  name: string;
  subtitle: string;
  description: string;
  ip?: string;
  links?: { label: string; url: string }[];
  contacts?: { label: string; value: string; url?: string }[];
  tags: string[];
  /** Static status for servers without an IP (e.g. in development) */
  status?: 'online' | 'offline' | 'in-development';
  operators: string[];
}

export const servers: Server[] = [
  {
    name: 'CubeX Lite',
    subtitle: '筑梦为家 · 温情养老',
    description: '由玩家共同维护，为高版本纯净养老生存玩家打造的宁静港湾。以"玩家自治、社区驱动"为核心理念，鼓励玩家建立社区化的聚集地，积极参与服务器的设计与政策制定。服务器已和平交接 6 轮服主，并允许有能力的玩家通过考核成为服主。珍视每位玩家的足迹，已公开一周目存档，保障回归或怀旧的权利。紧跟 Minecraft 更新步伐，支持 Java 版 1.13–1.21.8。',
    ip: 'play.cubexmc.org',
    links: [
      { label: '官网', url: 'https://cubexmc.top' },
      { label: '服务器文档', url: 'http://wiki.cubexmc.org' },
      { label: '工单系统', url: 'http://ticket.cubexmc.org' },
      { label: 'QQ 群', url: 'https://jq.qq.com/?_wv=1027&k=g38XNewm' },
      { label: 'CubeX Lite 存档合并', url: '/map' },
    ],
    tags: ['生存', '养老', '原版', '玩家自治', '社区驱动'],
    status: 'offline',
    operators: ['无，股东+维护共同管理'],
  },
  {
    name: 'CubeX ELite',
    subtitle: 'RPG 服务器',
    description: '由退休 CubeX 服主 Adlamb 开设的 RPG 服务器，在 CubeX 的社区基础上探索角色扮演和冒险玩法。目前正在内测开发中。',
    contacts: [
      { label: '内测群', value: '835031357' },
    ],
    tags: ['RPG', '冒险', '开发中'],
    status: 'in-development',
    operators: ['Adlambxd'],
  },
  {
    name: 'CubeX Wonderful',
    subtitle: '社区实验服',
    description: '基于 CubeX 一周目后期的测试服理念，由 wwwer、angushushu、addxiaoyi 共同推动的社区开服尝试。目前以 CubeX Wonderful 的名字继续开发。',
    contacts: [
      { label: 'Wonderful 群', value: '1042692728' },
    ],
    tags: ['生存', '社区', 'Wonderful', '开发中'],
    status: 'in-development',
    operators: ['wwwer', 'angushushu', 'addxiaoyi'],
  },
  {
    name: 'Gemocracy',
    subtitle: '玩家自治实验服 · 宝石民主',
    description: '革命性的 Minecraft 生存服务器。消除了传统管理员系统，权力通过物理宝石分配——正义宝石、真理宝石、飞行宝石、生命宝石、刺客宝石、土地宝石、导航宝石。玩家可以找到、偷取和使用宝石来获得临时的管理能力。"法律不是被给予的，而是被夺取的。信任是货币。作弊意味着终结。"',
    ip: 'mc.gemocracy.org',
    links: [
      { label: 'Discord', url: 'https://discord.gg/twSjTsKtpU' },
      { label: 'QQ 群', url: 'https://qm.qq.com/q/caVZGSf8VG' },
      { label: '实时地图', url: 'http://mc.gemocracy.org:12001/' },
      { label: 'GitHub', url: 'https://github.com/Gemocracy' },
    ],
    tags: ['自治', '实验', 'RuleGems', '七大宝石', '无传送'],
    status: 'online',
    operators: ['angushushu', 'FZAoao', 'addy', 'henrynph', 'oneflyfish'],
  },
  {
    name: 'StarMC',
    subtitle: '群组服',
    description: '原 CubeX 玩家 addxiaoyi 独立开设的群组服务器，提供多样化的游戏模式，延续了 CubeX 社区的开服精神。',
    ip: 'mc.star-mc.top',
    tags: ['群组', '多模式'],
    status: 'online',
    operators: ['addxiaoyi'],
  },
];
