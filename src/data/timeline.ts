export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export const timeline: TimelineEvent[] = [
  {
    year: '更早',
    title: 'WolfX Commune 社区',
    description: '在 CubeX 诞生之前，WolfX 的 Commune 社区已经聚集了一群热爱 Minecraft 的玩家。建筑佬、红石玩家、冒险家、养老玩家，Commune 为所有人敞开大门。这里的友谊和社区文化，成为 CubeX 诞生的土壤。',
  },
  {
    year: '2021.11',
    title: 'CubeX 服务器诞生',
    description: '2021 年 11 月，CubeX（方块叉）开始内测。以"有好多方块的服务器"为名，以养老生存为核心，服务器在 cubexmc.top 上线运营。一群来自 Commune 的玩家开启了属于方块叉的旅程。',
  },
  {
    year: '2024.09',
    title: '二周目',
    description: '大约 2024 年 9 月，二周目主服开启，延续养老生存的核心理念。管理团队持续壮大，社区文化逐渐形成。随后又开启了一周目怀旧服，让老玩家重温最初的记忆。',
  },
  {
    year: '2024–25',
    title: 'CubeX 研究院成型',
    description: 'CubeX 的老管理们将服务器、项目和贡献者网络整理为 CubeX 研究院。研究院接管了 GitHub CubeX-MC 组织和 Modrinth CubeX 页面，域名迁移至 cubexmc.org。插件生态逐步完善：EcoBalancer、Metro、Railway、RuleGems、FAWEReplace 相继开发。成员们开始开设不同的服务器，探索更多模式。',
  },
  {
    year: '2026.05',
    title: '泛 CubeX 概念',
    description: '原 CubeX 服务器逐渐衰落，被改称为 CubeX Lite。CubeX 研究院提出"泛 CubeX"概念——以 CubeX 品牌为核心，任何为 CubeX 做出过贡献的人都是泛 CubeX 社区的一部分。围绕这个核心，CubeX ELite、Gemocracy、StarMC、CubeX Wonderful 等多个服务器继续运转，CubeX 的探索精神延续。',
  },
];
