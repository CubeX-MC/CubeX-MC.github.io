export interface Person {
  name: string;
  aliases?: string[];
  role: string;
  description: string;
  links?: { label: string; url: string }[];
  badge?: string;
}

export interface PeopleSection {
  title: string;
  description: string;
  members: Person[];
  variant: 'core' | 'contributor' | 'retired';
}

export const people: PeopleSection[] = [
  {
    title: 'HyperCube',
    description: 'CubeX 的核心组织。HyperCube 维护着插件生态、GitHub 组织和 Modrinth 页面，协调各服务器的交流与合作。',
    variant: 'core',
    members: [
      {
        name: 'Adlambxd',
        aliases: ['Adlamb', '女装大佬'],
        role: 'HyperCube 成员 / CubeX ELite 创办人',
        description: 'HyperCube 核心成员。CubeX ELite RPG 商业服的创办人，在 CubeX Lite 退休后开启了新的探索。',
        links: [
          { label: '个人网站', url: 'https://adlambxd.github.io' },
        ],
      },
      {
        name: 'addxiaoyi',
        aliases: ['老钱'],
        role: 'HyperCube 成员 / StarMC 服主',
        description: '原 CubeX 基岩玩家，HyperCube 核心成员。独立开设了 StarMC 群组服务器，为社区提供多样化的游戏模式。',
      },
      {
        name: 'angushushu',
        role: 'HyperCube 成员',
        description: 'Commune，云湖边，CubeX，Gemocracy贡献者',
        links: [
          { label: '个人网站', url: 'https://angushushu.com' },
          { label: 'GitHub', url: 'https://github.com/angushushu' },
        ],
      },
      {
        name: 'Erblanz',
        aliases: ['红石佬'],
        role: 'HyperCube 成员',
        description: '云湖边社区管理，HyperCube 核心成员，红石方向。',
      },
      {
        name: 'ew',
        aliases: ['垃圾佬'],
        role: 'HyperCube 成员',
        description: 'HyperCube 核心成员。',
      },
      {
        name: 'FZAoao',
        role: 'HyperCube 成员 / Gemocracy 联合创始人',
        description: 'HyperCube 核心成员。Gemocracy 玩家自治服的联合创始人推动玩家自治的实验。',
      },
      {
        name: 'HotWind',
        aliases: ['技术佬'],
        role: 'HyperCube 成员',
        description: 'HyperCube 核心成员，技术方向。',
        links: [
          { label: '博客', url: 'https://blog.hotwind.cc' },
        ],
      },
      {
        name: 'itmn23',
        aliases: ['技术佬'],
        role: 'HyperCube 成员',
        description: 'HyperCube 核心成员，技术方向。',
      },
      {
        name: 'janhous',
        aliases: ['技术佬'],
        role: 'HyperCube 成员',
        description: 'HyperCube 核心成员，技术方向。',
        links: [
          { label: 'GitHub', url: 'https://github.com/janhous233' },
        ],
      },
      {
        name: 'LCDJ',
        role: 'HyperCube 成员',
        description: 'HyperCube 核心成员。',
      },
      {
        name: 'mark_q',
        aliases: ['老钱'],
        role: 'HyperCube 成员',
        description: 'CubeX Lite服主，HyperCube 核心成员。',
      },
      {
        name: 'Morgen_MC',
        aliases: ['肌肉佬'],
        role: 'HyperCube 成员',
        description: '云湖边社区管理，HyperCube 核心成员。',
      },
      {
        name: 'qorhe',
        aliases: ['建筑佬'],
        role: 'HyperCube 成员',
        description: 'CubeX官方建筑师，HyperCube 核心成员，建筑方向。',
      },
      {
        name: 'steve3184',
        aliases: ['公共技术佬'],
        role: 'HyperCube 成员',
        description: '多个服务器技术支持，HyperCube 核心成员，公共技术方向。',
      },
      {
        name: 'wwwer',
        role: 'HyperCube 成员 / 玩家服服主',
        description: '云湖边社区管理，原 CubeX OP，HyperCube 核心成员。与 angushushu 一起运营玩家服务器，致力于提供纯粹的 Minecraft 体验。',
      },
    ],
  },
  {
    title: 'CubeX 贡献者',
    description: '为 CubeX 做出过重要贡献的成员。他们是泛 CubeX 社区不可或缺的一部分。',
    variant: 'contributor',
    members: [
      {
        name: 'AkariDream',
        aliases: ['AkaneCh4n', 'FallenCrystal'],
        role: 'CubeX 重要贡献者',
        description: 'CubeX 的核心贡献者之一，曾深度参与服务器运营和社区建设。',
        links: [
          { label: 'GitHub', url: 'https://github.com/AkaneCh4n' },
        ],
      },
      {
        name: 'SiYang',
        role: 'CubeX 重要贡献着',
        description: 'Commune社区和CubeX 创始人之一，曾为社区做出重要贡献。',
        links: [
          { label: '个人网站', url: 'https://siyangchen.com/' },
        ],
      },
    ],
  },
];
