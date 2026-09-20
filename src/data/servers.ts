/** One connectable address of a server instance */
export interface ServerAddress {
  /** Client edition: Java 版 / 基岩版 */
  edition: 'JE' | 'BE';
  host: string;
  port?: number;
  /** Supported client versions for this edition */
  versions?: string;
}

/** A running instance of a server (main world, test world, ...) */
export interface ServerInstance {
  name: string;
  addresses: ServerAddress[];
  /** Server-side version */
  version?: string;
  seed?: string;
  mapUrl?: string;
}

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
  /** Connection details for servers running several instances or editions */
  instances?: ServerInstance[];
  /** Tips shown alongside the connection details */
  notes?: string[];
  operators?: string[];
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
    name: 'StarMC',
    subtitle: '群组服',
    description: '原 CubeX 玩家 addxiaoyi 独立开设的群组服务器，提供多样化的游戏模式，延续了 CubeX 社区的开服精神。',
    ip: 'mc.star-mc.top',
    tags: ['群组', '多模式'],
    status: 'online',
    operators: ['addxiaoyi'],
  },
  {
    name: '清屿服',
    subtitle: '生电服务器 · QingYu',
    description: '面向生电（技术向生存）玩法的服务器，同时开放 Java 版与基岩版入口。主服之外另设一个与主服同种子的测试服，方便在正式建造前验证机器与红石设计；两个服务器都提供网页地图。主服上 Java 与基岩版的同 ID 账号数据互通，测试服是否互通请留意后续公告。',
    ip: '202.189.10.108:20577',
    links: [
      { label: '主服网页地图', url: 'http://202.189.10.108:20851' },
      { label: '测试服网页地图', url: 'http://202.189.10.109:30198/' },
    ],
    tags: ['生电', '红石科技', 'JE/BE 互通', '主服 + 测试服'],
    status: 'online',
    instances: [
      {
        name: '生电主服',
        version: '26.2',
        seed: '-3636732475308954',
        mapUrl: 'http://202.189.10.108:20851',
        addresses: [
          { edition: 'JE', host: '202.189.10.108', port: 20577, versions: '1.20 - 26.2' },
          { edition: 'BE', host: '202.189.10.108', port: 20577, versions: '26.0 - 26.45' },
        ],
      },
      {
        name: '测试服',
        version: '26.2',
        seed: '-3636732475308954',
        mapUrl: 'http://202.189.10.109:30198/',
        addresses: [
          { edition: 'JE', host: '202.189.10.109', port: 30187, versions: '1.20 - 26.2' },
          { edition: 'BE', host: '202.189.10.109', port: 30187, versions: '26.0 - 26.45' },
        ],
      },
    ],
    notes: [
      '绑定后 QQ 群名片会自动改为你的游戏 ID；若没有自动更换，可以手动修改。',
      '商店区域卡顿时建议安装 ImmediatelyFast Mod，通过批处理绘制调用大幅提升 FPS——实测 200 个带文本告示牌性能提升 2.7 倍，400 个箱子提升 1.3 倍。',
      'Java 版与基岩版同 ID 账号数据互通（主服适用；测试服是否互通请留意后续公告）。',
    ],
    operators: ['ALingqing'],
  },
];
