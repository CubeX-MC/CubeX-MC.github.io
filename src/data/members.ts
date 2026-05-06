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
  variant: 'core' | 'retired';
}

export const people: PeopleSection[] = [
  {
    title: 'HyperCube',
    description: 'CubeX 的核心组织。HyperCube 维护着插件生态、GitHub 组织和 Modrinth 页面，协调各服务器的交流与合作。',
    variant: 'core',
    members: [
      {
        name: 'Adlambxd',
        aliases: ['AdlambXD', '女装大佬'],
        role: 'HyperCube 成员 / CubeX ELite 创办人',
        description: 'HyperCube 核心成员。CubeX ELite RPG 商业服的创办人，在 CubeX Lite 退休后开启了新的探索。曾担任 CubeX 二周目服主，任职期间引入了 .top 域名。',
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
        aliases: ['KangmiNansen'],
        role: 'HyperCube 成员 / CubeX 服主',
        description: 'HyperCube 核心成员，CubeX 服主。与 steve3184 并肩从普通玩家成长为服主，2025 年暑期与 Mark_Q、steve3184 联合成为主事。',
      },
      {
        name: 'mark_q',
        aliases: ['老钱'],
        role: 'HyperCube 成员 / CubeX 服主',
        description: 'CubeX Lite 服主，HyperCube 核心成员。xingchen 被弹劾后与 AdlambXD 一同上位，后联合 LCDJ 和 steve3184 成为 CubeX 主事。',
      },
      {
        name: 'Morgen_yc',
        aliases: ['肌肉佬'],
        role: 'HyperCube 成员',
        description: '云湖边社区管理，HyperCube 核心成员。以温和公正的态度化解玩家间的矛盾与纷争，是社区和谐与稳定的基石。',
      },
      {
        name: 'qorhe',
        aliases: ['建筑佬'],
        role: 'HyperCube 成员',
        description: 'CubeX官方建筑师，HyperCube 核心成员，建筑方向。',
      },
      {
        name: 'Steve3184',
        aliases: ['公共技术佬'],
        role: 'HyperCube 成员 / CubeX 服主',
        description: 'CubeX 现任服主之一。2021 年底作为普通玩家加入 CubeX，从搭建第一座小木屋起步，逐步凭借技术能力承担服务器技术支持，最终成长为服主。全栈开发者，擅长 Node.js、Python、Java 及服务器运维，同时负责一周目怀旧服（old.cubexmc.org）的维护。',
      },
      {
        name: 'wwwer',
        role: 'HyperCube 成员 / 玩家服服主',
        description: '云湖边社区管理，原 CubeX OP，HyperCube 核心成员。小湖镇管理者，通过小湖镇复兴 CubeX 的关键人物，后与 angushushu 一同运营玩家服务器。2024 年 1 月与 angushushu 一同半退休。',
      },
    ],
  },
  {
    title: '贡献者',
    description: '为 CubeX 做出过重要贡献的成员。他们的付出铸就了"铁打的服务器，流水的管理"的基石。',
    variant: 'retired',
    members: [
      {
        name: 'AkariDream',
        aliases: ['AkaneCh4n', 'FallenCrystal'],
        role: 'CubeX 贡献者',
        description: 'Commune 社区和 CubeX 联合创始人之一。CubeX 开服后的核心管理者，曾扶持 XY_Kuailexy 接手服务器，深度参与服务器运营和社区建设。',
        links: [
          { label: 'GitHub', url: 'https://github.com/AkaneCh4n' },
        ],
      },
      {
        name: 'SiYang',
        role: 'CubeX 贡献者 / 前服主',
        description: 'Commune 社区和 CubeX 联合创始人之一。曾两度为 CubeX 倾注心血，在 angushushu 和 wwwer 半退休后回归主事，为社区做出重要贡献。',
        links: [
          { label: '个人网站', url: 'https://siyangchen.com/' },
        ],
      },
      {
        name: 'linzaiua',
        role: 'CubeX 贡献者',
        description: '与 tomeggo、hextech、angushushu、SiYang 一起作为 CubeX 的创始人。',
      },
      {
        name: 'NinKauneus',
        role: 'CubeX 前管理 / 前玩家代表',
        description: '曾任玩家代表与管理员，是社区最耐心的倾听者与最忠实的传声筒。从"传达者"转变为"守护者"，以低调、严谨而高效的管理风格守护着服务器的和谐。因为过于善良，被无差别伤害波及破防退休。',
      },
      {
        name: 'Jason31416',
        role: 'CubeX 贡献者 / 前服主',
        description: '自称"从隔壁服来 CubeX 摆烂的屑腐竹兼技术"。实际上搭建了稳固的后台框架与高效的解决方案，是"铁打的服务器"承诺的直接铸造者之一。',
      },
      {
        name: 'fire_god',
        role: 'CubeX 贡献者 / 前 OP',
        description: '从试用管理一步步晋升至 OP，破获 CubeX 最大权限滥用案件，捍卫了服务器的公平正义，向社区传递了"规则与公平高于一切"的信号。',
      },
      {
        name: 'RoiAsn',
        role: 'CubeX 贡献者',
        description: '留下的临别赠言只有"随意"二字，却精准概括了 CubeX"生存养老"的理念。如风一般的管理者，在社区需要时贡献力量，一切步入正轨后便悄然隐去。',
      },
      {
        name: 'hextech',
        role: 'CubeX 贡献者 / 前服主',
        description: '自称"平平无奇毫无贡献的腐竹"。实际上将技术能力无声地注入服务器底层架构，确保了稳定运行，是"无痕"基石的铸造者。',
      },
      {
        name: 'tomeggo',
        role: 'CubeX 贡献者 / 前服主',
        description: '"佛系腐竹，忙于在属于牛马的大草原上奔跑。"奉行无为而治的智慧，相信社区的自我净化与自我发展能力，留下了一种平等、自由与尊重的社区氛围。',
      },
      {
        name: 'XY_Kuailexy',
        role: 'CubeX 贡献者 / 前服主',
        description: '由 AkariDream 提拔的服主。2023 年 1 月 angushushu 第一次尝试退休期间，根据 AkariDream 建议接手管理。',
      },
      {
        name: 'Ricky',
        role: 'CubeX 贡献者 / 前服主',
        description: '与 GNBM、Jason 同一期的 CubeX 二周目服主。',
      },
      {
        name: 'xingchen',
        role: 'CubeX 贡献者 / 前服主',
        description: '2024 年 6 月 angushushu 等人正式退休后被提拔的服主，后因撒谎和贪污服务器全部捐款被弹劾。',
      },
      {
        name: 'GNBM',
        role: 'CubeX 贡献者 / 前服主',
        description: '与 Ricky、Jason 同一期的 CubeX 二周目服主。',
      },
      {
        name: 'Qraekee',
        role: 'CubeX 贡献者',
        description: '为 CubeX 二周目贡献了半个服务器机器的玩家。',
      },
    ],
  },
];

export interface AdminTimelineEvent {
  description: string;
}

export const adminTimeline: AdminTimelineEvent[] = [
  { description: 'Commune 社区 — 两个追求权力的人在别人的社区里做着"我要掌管一切"的美梦。天真得令人心疼。' },
  { description: 'CubeX 开服 — 拉来第三个冤大头，三人正式开始了一场"谁先跑谁是小狗"的囚徒困境。' },
  { description: '首次裂痕 — SiYang 和 angushushu 吵翻了。意料之中——两个创始人不翻脸的服务器还没出生过。' },
  { description: '第一次交接 — angushushu "退休"了，AkariDream 推了个傀儡上位，自己垂帘听政。可惜扶持的狗腿子 xmzh 封人封到自己人都受不了，服务器当场暴毙。' },
  { description: '回归与决裂 — 眼看服务器要凉，angushushu 光速"复出"，跟 AkariDream 撕破脸。"退休"这事儿就像减肥，说起来容易。' },
  { description: '小湖镇复兴 — angushushu 在一堆废墟里发现了一个叫 wwwer 的老实人，二话不说提拔成 OP。至于 wwwer 后来有没有后悔，只有她自己知道。' },
  { description: '短暂重聚 — AkariDream："我也想回来玩。" angushushu："行吧。" 翻译：我想再试一次夺权。行吧但我不让。' },
  { description: '故人归来 — SiYang 回来了。三巨头共治！历史上三巨头共治的下场通常是一个被流放，一个被暗杀，一个独吞。' },
  { description: '半退休时代 — angushushu 和 wwwer "半退休"，翻译：退居幕后继续操控。开了个测试服，美其名曰"技术探索"，实为下一盘大棋。SiYang 前台撑场面，压根不知道自己是傀儡。' },
  { description: '预备交接 — SiYang 终于也退了。AdlambXD 和 Mark_Q 作为预备服主登场——两个等着接盘的接盘侠。' },
  { description: '二周目开启 — angushushu 等人"正式退休"（第 N 次），推出 xingchen 当白手套。在 angushushu 的"建议"下，xingchen 拿测试服开了二周目。说白了：用别人的手赌一把，赢了是我的功劳，输了是他的锅。' },
  { description: '弹劾风波 — xingchen 贪污了服务器全部捐款，被抓了个现行。说实话，在这个充满理想主义的地方搞贪污，格局小了。AdlambXD 和 Mark_Q 闪亮登场"救火"——早就等着这一天了。' },
  { description: '实体机时代 — 几位服主凑钱买了台实体机，放到了 Mark 家。物理意义上的"服务器在我家所以我是服主"。AdlambXD 主事。' },
  { description: '权力更迭 — AdlambXD 确实保守，所有人提的意见他全否了，服务器像个死水塘。于是 angushushu 在幕后煽风点火，推了 LCDJ 和 steve3184 上前台，把 AdlambXD 架空了。妙的是，CubeX 从一周目起就有"投票表决"的传统——结果这波架空直接把遮羞布撕了，大家发现规则原来只是摆设。从此打开了潘多拉魔盒，为后面 Mark_Q 的独断专行铺平了道路。' },
  { description: '停滞 — Mark_Q 拿到了实体机和 QQ 群。有了机器就有了服务器，有了群就有了玩家。然后——他消失了。也许这才是最大的地狱笑话：折腾了十四轮权力更替，最后谁都没得玩。' },
];
