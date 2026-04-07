export interface PlantMorphology {
  overallForm: string;  // 整体形态
  flower: string;       // 花
  fruit: string;        // 果实
  stem: string;         // 茎
  root: string;         // 根
  rootType: '直根系' | '须根系' | '不定根' | '块根' | '根茎';
  leaf: string;         // 叶
  leafShape: string;    // 叶形
  growthData: string;   // 生长数据
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  family: string;
  environment: string;
  features: string;
  emoji: string;
  color: string;
  story: string;
  knowledge: string;
  poem: string;
  quiz: { question: string; options: string[]; answer: number }[];
  scene: { name: string; description: string };
  stages: { name: string; emoji: string; description: string; unlockContent: string }[];
  morphology: PlantMorphology;
}

export interface SeedCard {
  plantId: string;
  collectedAt: string;
  currentStage: number;
  unlocked: boolean[];
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: number;
  type: 'collect' | 'learn' | 'game';
}

export const achievements: Achievement[] = [
  { id: 'first-seed', name: '第一颗种子', emoji: '🌱', description: '收集你的第一颗种子', requirement: 1, type: 'collect' },
  { id: 'seed-5', name: '小小收藏家', emoji: '🎒', description: '收集5颗种子', requirement: 5, type: 'collect' },
  { id: 'quiz-3', name: '知识小达人', emoji: '🧠', description: '完成3次问答', requirement: 3, type: 'learn' },
  { id: 'game-5', name: '游戏高手', emoji: '🎮', description: '完成5个游戏', requirement: 5, type: 'game' },
  { id: 'full-grow', name: '园艺大师', emoji: '🌳', description: '将一棵植物培育到结果', requirement: 1, type: 'collect' },
];

export const dailyKnowledge = [
  '你知道吗？世界上最大的花是大王花，直径可达1米！它闻起来像腐肉，用气味吸引苍蝇来帮忙传粉。',
  '竹子是世界上生长最快的植物，一天可以长近1米！竹子其实是一种草，不是树哦。',
  '含羞草被碰到就会合拢叶子，这是因为叶柄底部的细胞失去水分导致的，叫做"感震运动"。',
  '世界上最古老的树超过5000岁！它是一棵叫"玛士撒拉"的狐尾松，生长在美国加利福尼亚。',
  '仙人掌的刺其实是退化的叶子，这样可以减少水分蒸发，帮助它在沙漠中生存。',
  '向日葵的花盘上的种子排列遵循"斐波那契数列"，这是大自然中的数学之美！',
  '荷叶表面有纳米级的小突起，水滴落上去会变成圆球滚落，带走灰尘，这就是"自清洁效应"。',
  '一棵大橡树每天可以吸收大约400升水，通过蒸腾作用把水分释放到空气中。',
  '世界上最小的开花植物叫无根萍，只有1毫米大小，比一粒盐还小！',
  '番茄曾被欧洲人认为有毒，叫做"毒苹果"，直到18世纪才被广泛食用。',
  '椰子不是坚果，它的学名意思是"长着猴子脸的果实"，是一种核果。',
  '植物也会"说话"！受到虫害的植物会释放化学物质，警告周围的同伴注意防御。',
  '香蕉其实是一种浆果，而草莓在植物学上并不是真正的浆果，它是聚合果。',
  '地球上现存最大的生物是一棵叫"谢尔曼将军"的巨杉，体积约1487立方米。',
  '薄荷的清凉感来自薄荷醇，它能欺骗你的感觉神经，让大脑觉得"冷"。',
  '树木的年轮可以告诉我们每一年的气候：宽的年轮代表雨水充沛，窄的代表干旱。',
  '捕蝇草能在0.1秒内合拢叶片捕捉昆虫，是植物界的"闪电侠"！',
  '菠萝需要两到三年才能结一个果实，而且每株菠萝一次只结一个。',
  '银杏被称为"活化石"，在恐龙时代就已经存在了，有2.7亿年的历史！',
  '玫瑰花瓣可以食用，很多地方用玫瑰做果酱、茶和糕点。',
  '苔藓没有根，它通过整个身体吸收水分和养分，就像一块活的海绵。',
  '辣椒的辣味来自辣椒素，这其实是植物保护自己不被哺乳动物吃掉的方式。',
  '一朵向日葵的花盘上实际有上千朵小花，我们看到的"一朵花"是由许多小花组成的。',
  '松果在潮湿天气会合拢鳞片，干燥时会张开，可以用来预测天气变化！',
  '柳树皮含有水杨酸，这是阿司匹林的原始来源，古人用柳树皮来缓解疼痛。',
  '猪笼草不仅能捕虫，有些种类大到可以捕捉小型蜥蜴和老鼠！',
  '全世界约有40万种已知植物，每年还有约2000种新植物被发现。',
  '土豆、番茄、辣椒都属于茄科，它们竟然是"亲戚"！',
  '棉花的白色纤维其实是种子上的毛，帮助种子随风飘散传播。',
  '睡莲在白天开花，晚上闭合，就像每天按时"上下班"一样。',
];

export const plants: Plant[] = [
  {
    id: 'sunflower',
    name: '向日葵',
    scientificName: 'Helianthus annuus',
    category: '草本植物',
    family: '菊科',
    environment: '喜欢阳光充足、温暖的环境，需要排水良好的土壤',
    features: '高大的茎秆，大型花盘，花朵跟随太阳转动',
    emoji: '🌻',
    color: 'sun',
    story: '在一片金色的田野里，住着一位叫"小阳"的向日葵。每天早晨，小阳都会伸展自己金色的花瓣，对着太阳公公说"早安"！小阳有一个秘密——它的花盘里藏着好多好多小瓜子宝宝。每到秋天，小瓜子们就会坐着风的滑梯，去寻找自己的新家。',
    knowledge: '向日葵是一种很特别的植物！它的花朵会跟着太阳转动，这叫做"向光性"。向日葵的种子就是我们常吃的瓜子，富含维生素E和健康脂肪。一朵向日葵的花盘上可以有多达2000颗种子呢！',
    poem: '更无柳絮因风起，惟有葵花向日倾。——司马光《客中初夏》\n\n向日葵总是面向太阳，就像小朋友们总是充满希望和活力！',
    quiz: [
      { question: '向日葵的花朵会跟着什么转动？', options: ['月亮', '太阳', '风', '水'], answer: 1 },
      { question: '向日葵的种子是什么？', options: ['花生', '瓜子', '芝麻', '大豆'], answer: 1 },
      { question: '向日葵属于哪个科？', options: ['菊科', '蔷薇科', '百合科', '豆科'], answer: 0 },
    ],
    scene: { name: '金色田野', description: '在广阔的金色田野上，成千上万的向日葵排列成行，它们的花盘像一面面金色的镜子，映照着夏日的阳光。蜜蜂在花丛中忙碌地采蜜，蝴蝶翩翩起舞，田野尽头是蔚蓝的天空和洁白的云朵。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '一颗小小的、黑白条纹的种子，静静地躺在泥土里等待发芽', unlockContent: '向日葵种子是最美味的零食之一！' },
      { name: '发芽', emoji: '🌱', description: '两片嫩绿的子叶从土里钻出来，好奇地张望这个世界', unlockContent: '向日葵种子3-5天就能发芽！' },
      { name: '生长', emoji: '🪴', description: '茎秆越来越高，叶子越来越大，像一把把绿色的扇子', unlockContent: '向日葵可以长到3米高，比爸爸还高！' },
      { name: '开花', emoji: '🌻', description: '金色的花盘绽放，像一个小太阳，跟着大太阳转', unlockContent: '向日葵开花后会吸引很多蜜蜂来帮忙传粉' },
      { name: '结果', emoji: '🌰', description: '花盘上结满了排列整齐的种子，等待收获', unlockContent: '一朵向日葵可以结出2000多颗种子！' },
    ],
    morphology: {
      overallForm: '一年生草本，高1-3.5米，茎直立粗壮，全株被白色粗硬毛',
      flower: '头状花序，直径10-30厘米，边缘舌状花金黄色，中央管状花棕色，由上千朵小花组成',
      fruit: '瘦果（瓜子），倒卵形，黑色或黑白条纹，长1-1.5厘米',
      stem: '直立茎，圆柱形，粗壮中空，绿色，高1-3.5米，被粗糙刚毛',
      root: '主根发达，入土可达3米，侧根分布广，吸水能力强',
      rootType: '直根系',
      leaf: '互生，大型心形或卵形叶，叶缘有锯齿，叶面粗糙，宽10-30厘米',
      leafShape: '心形/卵形',
      growthData: '生长周期70-120天，株高1-3.5m，花期7-9月，适温20-30℃',
    },
  },
  {
    id: 'lotus',
    name: '荷花',
    scientificName: 'Nelumbo nucifera',
    category: '水生植物',
    family: '莲科',
    environment: '生长在池塘、湖泊等浅水区域，喜欢温暖湿润',
    features: '大型圆形叶片，粉色或白色花朵，出淤泥而不染',
    emoji: '🪷',
    color: 'petal',
    story: '在一个宁静的荷塘里，住着一位叫"莲莲"的小荷花。莲莲从小就住在泥巴里，但她从不害怕弄脏。每年夏天，莲莲都会穿上最漂亮的粉色裙子，从水面上冒出来和小鱼、小青蛙们做朋友。她的裙子有一个神奇的魔法——任何水滴落在上面都会变成一颗颗闪亮的水晶珠！',
    knowledge: '荷花又叫莲花，是一种非常古老的植物，已经存在了1亿多年！荷花的叶子有自清洁的能力，水滴落上去会变成圆溜溜的小水珠滚落，这叫"荷叶效应"。荷花全身都是宝：莲子可以吃，莲藕可以做菜，荷叶可以泡茶！',
    poem: '接天莲叶无穷碧，映日荷花别样红。——杨万里《晓出净慈寺送林子方》\n\n小荷才露尖尖角，早有蜻蜓立上头。——杨万里《小池》',
    quiz: [
      { question: '荷花生长在什么地方？', options: ['沙漠', '山顶', '池塘', '森林'], answer: 2 },
      { question: '荷花的果实叫什么？', options: ['苹果', '莲子', '葡萄', '橘子'], answer: 1 },
      { question: '荷叶上的水珠为什么不会散开？', options: ['因为有胶水', '因为荷叶效应', '因为水太少', '因为风太小'], answer: 1 },
    ],
    scene: { name: '江南水乡', description: '青石板铺成的小路蜿蜒在白墙黛瓦之间，一座拱形石桥跨过碧绿的河面。桥下荷花盛开，粉色和白色的花朵点缀在翠绿的荷叶之间。远处传来悠扬的笛声，一只翠鸟停在荷叶边，凝望着水中的鱼儿。' },
    stages: [
      { name: '莲子', emoji: '🫘', description: '一颗圆圆的莲子沉入池塘底部的淤泥中', unlockContent: '莲子可以保存千年还能发芽！' },
      { name: '发芽', emoji: '🌱', description: '嫩绿的小芽从淤泥中伸出，穿过水层', unlockContent: '荷花的种子在泥里也能顽强生长' },
      { name: '浮叶', emoji: '🍃', description: '圆圆的小叶子浮在水面上，像一个个绿色的盘子', unlockContent: '荷叶能防水是因为表面有纳米结构' },
      { name: '开花', emoji: '🪷', description: '美丽的粉色花朵从水面升起，清香扑鼻', unlockContent: '荷花凌晨开放，傍晚闭合，持续3天' },
      { name: '结藕', emoji: '🥢', description: '水下的根茎变成了胖胖的莲藕', unlockContent: '莲藕有很多孔，是为了在水下呼吸！' },
    ],
    morphology: {
      overallForm: '多年生水生草本，根茎横生于水底淤泥中，叶和花挺出水面',
      flower: '单生花，直径10-20厘米，花瓣多层，粉色或白色，花托呈倒锥形（莲蓬）',
      fruit: '坚果（莲子），椭圆形，藏于莲蓬中，外壳坚硬，可食用',
      stem: '花茎和叶柄中空，内有通气孔道，挺出水面高1-2米',
      root: '地下茎为莲藕，横生肥大，节间膨大，内有多个孔道用于呼吸',
      rootType: '根茎',
      leaf: '圆形盾状叶，直径25-90厘米，表面有蜡质层，具有自清洁效应',
      leafShape: '盾形/圆形',
      growthData: '生长周期全年，花期6-9月，适温22-32℃，水深30-120cm',
    },
  },
  {
    id: 'plum',
    name: '梅花',
    scientificName: 'Prunus mume',
    category: '乔木',
    family: '蔷薇科',
    environment: '耐寒性强，在冬末春初开花，喜光照',
    features: '冬季开花，花色多为粉红或白色，有清香',
    emoji: '🌸',
    color: 'petal',
    story: '在一个寒冷的冬天，其他花朵都躲在泥土里睡觉，只有小梅花"梅梅"勇敢地绽放了。雪花姐姐对梅梅说："你不冷吗？"梅梅笑着说："我就是要在最冷的时候给大家带来温暖！"后来，所有的小动物都来看梅梅，他们说梅梅是最勇敢的花朵。',
    knowledge: '梅花是中国十大名花之首，被称为"花中之魁"！梅花能在零下10度的寒冷天气中开花，它是冬天里最早开放的花。梅花和松树、竹子一起被称为"岁寒三友"，象征着坚强和不怕困难的精神。',
    poem: '墙角数枝梅，凌寒独自开。遥知不是雪，为有暗香来。——王安石《梅花》\n\n梅花告诉我们：在困难的时候也要勇敢坚强！',
    quiz: [
      { question: '梅花在什么季节开花？', options: ['春天', '夏天', '秋天', '冬天'], answer: 3 },
      { question: '"岁寒三友"不包括？', options: ['梅花', '松树', '竹子', '荷花'], answer: 3 },
      { question: '梅花象征什么精神？', options: ['懒惰', '坚强', '害怕', '骄傲'], answer: 1 },
    ],
    scene: { name: '冬日雪景', description: '白雪覆盖了整个山林，银装素裹的世界里一片寂静。唯有山坡上几株老梅树傲然挺立，粉红色的花朵在枝头绽放，花瓣上沾着晶莹的雪花。远处的小木屋烟囱里升起袅袅炊烟，一只小松鼠在梅树下探头探脑。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '梅核被包在坚硬的外壳里，等待春天', unlockContent: '梅子可以做成美味的酸梅汤！' },
      { name: '幼苗', emoji: '🌱', description: '春天来了，小苗从土里探出头来', unlockContent: '梅花树需要经历寒冷才能更好开花' },
      { name: '树木', emoji: '🌳', description: '小树渐渐长大，枝干变得遒劲有力', unlockContent: '梅花树可以活上百年！' },
      { name: '开花', emoji: '🌸', description: '冬天来了，满树的梅花在雪中绽放', unlockContent: '一棵梅树可以开出上千朵花！' },
      { name: '结果', emoji: '🫒', description: '春天，花谢后结出青色的梅子', unlockContent: '青梅煮酒是中国古老的文化传统' },
    ],
    morphology: {
      overallForm: '落叶小乔木，高4-10米，树冠开展，枝干苍劲古朴',
      flower: '先叶开放，1-2朵簇生，直径2-2.5厘米，5瓣，有白、粉、红等色，芳香',
      fruit: '核果（梅子），球形，直径2-3厘米，黄色或绿色，味酸',
      stem: '树干灰褐色，小枝绿色，多年生枝条遒劲弯曲，树皮纵裂',
      root: '主根深入土中，侧根发达，固土能力强，耐瘠薄',
      rootType: '直根系',
      leaf: '互生，卵形至椭圆形，叶缘有细锯齿，叶长4-8厘米，先端渐尖',
      leafShape: '卵形/椭圆形',
      growthData: '树高4-10m，花期12-3月，果期5-6月，寿命可达数百年',
    },
  },
  {
    id: 'rose',
    name: '月季',
    scientificName: 'Rosa chinensis',
    category: '灌木',
    family: '蔷薇科',
    environment: '喜阳光充足、通风良好的环境，适应性强',
    features: '四季开花，花色丰富，有刺，芳香浓郁',
    emoji: '🌹',
    color: 'petal',
    story: '在一座美丽的花园里，住着一位叫"月月"的月季花。月月有一个特别的本领——她每个月都能开出新花！春天的粉色、夏天的红色、秋天的橙色、冬天的白色。其他花朵都很羡慕，月月笑着说："只要心中有阳光，每一天都是花开的好日子！"',
    knowledge: '月季被称为"花中皇后"，是中国十大名花之一！月季和玫瑰是亲戚，都属于蔷薇科。月季最厉害的地方是四季都能开花，所以叫"月月红"。世界上有三万多个月季品种，花色从白色到深红色，甚至有蓝紫色！月季的茎上有倒钩状的刺，是它保护自己的武器。',
    poem: '花开花落无间断，春来春去不相关。牡丹最贵惟春晚，芍药虽繁只夏初。唯有此花开不厌，一年长占四时春。——苏轼《月季》\n\n月季告诉我们：坚持不懈，每一天都能绽放光彩！',
    quiz: [
      { question: '月季为什么叫"月月红"？', options: ['因为是红色的', '因为月月开花', '因为像月亮', '因为月光下好看'], answer: 1 },
      { question: '月季属于哪个科？', options: ['菊科', '蔷薇科', '百合科', '兰科'], answer: 1 },
      { question: '月季和哪种花是亲戚？', options: ['荷花', '菊花', '玫瑰', '兰花'], answer: 2 },
    ],
    scene: { name: '欧式花园', description: '一座精致的欧式花园里，拱形的花架上爬满了各色月季。红的、粉的、黄的、白的花朵层层叠叠，空气中弥漫着甜蜜的芳香。石板小路蜿蜒其中，一只蜜蜂在花丛中忙碌采蜜，喷泉在阳光下闪烁着彩虹般的水雾。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '一粒小小的月季种子被埋入肥沃的土壤', unlockContent: '月季也可以通过扦插繁殖！' },
      { name: '发芽', emoji: '🌱', description: '嫩绿的小芽从土中探出头来', unlockContent: '月季幼苗需要充足的阳光' },
      { name: '生长', emoji: '🪴', description: '枝条不断伸展，长出带刺的茎和翠绿的叶子', unlockContent: '月季的刺是变态的表皮附属物' },
      { name: '花苞', emoji: '🌷', description: '枝头出现饱满的花苞，即将绽放', unlockContent: '一个花苞从出现到开放约需7-10天' },
      { name: '盛放', emoji: '🌹', description: '层层花瓣绽放，散发迷人芳香', unlockContent: '一朵月季花约有40-60片花瓣！' },
    ],
    morphology: {
      overallForm: '常绿或半常绿灌木，高1-2米，枝条直立或攀援',
      flower: '单生或簇生，重瓣，直径5-12厘米，花色极丰富（红、粉、黄、白、橙等），芳香',
      fruit: '蔷薇果（营果），球形或梨形，成熟时红色，内含多粒瘦果',
      stem: '直立或攀援，绿色或红褐色，散生倒钩状皮刺',
      root: '主根较深，须根发达，嫁接苗根系更强健',
      rootType: '直根系',
      leaf: '互生，奇数羽状复叶，小叶3-5枚，椭圆形，叶缘有锐锯齿，叶面光亮',
      leafShape: '羽状复叶/椭圆形',
      growthData: '株高1-2m，花期全年（盛花4-10月），适温15-28℃，寿命数十年',
    },
  },
  {
    id: 'orchid',
    name: '兰花',
    scientificName: 'Cymbidium',
    category: '草本植物',
    family: '兰科',
    environment: '喜半阴湿润环境，通风良好，忌强光直射',
    features: '叶片修长飘逸，花朵清雅，幽香远溢',
    emoji: '🌺',
    color: 'leaf',
    story: '在幽静的山谷深处，住着一位叫"幽幽"的兰花姑娘。幽幽不像其他花朵那样争奇斗艳，她安静地生长在石缝和树根旁。有一天，一阵微风吹过，把幽幽的清香送到了很远的地方。"原来不需要站在最高处，只要做最好的自己，芬芳自然会被人发现。"幽幽微笑着说。',
    knowledge: '兰花是中国传统文化中的"四君子"之一（梅兰竹菊），象征高洁、典雅。中国人养兰花已有两千多年的历史！兰花品种极多，全世界约有28000种，是开花植物中最大的科之一。兰花有一个神奇的特点——它的花粉结成一团叫"花粉块"，需要特定的昆虫来帮忙传粉。',
    poem: '身在千山顶上头，突岩深缝妙香稠。非无脚下浮云闹，来不相知去不留。——郑板桥《题画兰》\n\n兰花教会我们：淡泊宁静，品格高洁。',
    quiz: [
      { question: '兰花属于"四君子"中的哪一种？', options: ['梅', '兰', '竹', '菊'], answer: 1 },
      { question: '兰花喜欢什么样的环境？', options: ['强光暴晒', '半阴湿润', '干燥沙漠', '深水环境'], answer: 1 },
      { question: '兰花的花粉有什么特点？', options: ['像粉末', '结成块', '没有花粉', '是液体'], answer: 1 },
    ],
    scene: { name: '幽谷深林', description: '苍翠欲滴的深山幽谷中，阳光透过密密的树冠洒下斑驳的光点。溪水潺潺流过长满苔藓的岩石，兰花生长在古树的根部和石缝之间，修长的叶片随风轻摇。蝴蝶被兰花的幽香吸引而来，山间云雾缭绕如仙境。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '极其微小的兰花种子随风飘散', unlockContent: '兰花种子非常小，一粒如灰尘！' },
      { name: '萌发', emoji: '🌱', description: '种子与真菌共生，缓慢萌发', unlockContent: '兰花种子需要真菌帮助才能发芽' },
      { name: '长叶', emoji: '🌿', description: '修长飘逸的叶片从假鳞茎中抽出', unlockContent: '兰花的叶片可以进行光合作用储存养分' },
      { name: '抽莛', emoji: '🪴', description: '花莛从叶丛中抽出，顶端有花苞', unlockContent: '兰花从抽莛到开花约需一个月' },
      { name: '开花', emoji: '🌺', description: '清雅的花朵绽放，幽香四溢', unlockContent: '一朵兰花可以持续开放2-4周！' },
    ],
    morphology: {
      overallForm: '多年生草本，有假鳞茎，叶丛生，株高30-80厘米',
      flower: '总状花序，花5-15朵，花径4-8厘米，花被片6枚，唇瓣特化，色有绿、黄、白等，幽香',
      fruit: '蒴果，长椭圆形，成熟时沿3条缝线裂开，种子极微小如粉尘',
      stem: '假鳞茎短粗，卵形或椭圆形，是养分储存器官',
      root: '肉质须根，粗壮白色，表面有根被（海绵状组织），可吸收空气中的水分',
      rootType: '须根系',
      leaf: '线形或带形，长30-80厘米，革质，叶脉平行，叶端渐尖，深绿色',
      leafShape: '线形/带形',
      growthData: '株高30-80cm，花期因种而异（春兰2-3月，建兰7-10月），适温15-25℃',
    },
  },
  {
    id: 'pine',
    name: '松树',
    scientificName: 'Pinus',
    category: '乔木',
    family: '松科',
    environment: '适应性极强，能在贫瘠山地生长，耐旱耐寒',
    features: '常绿针叶，树皮粗糙，松果中含有种子',
    emoji: '🌲',
    color: 'leaf',
    story: '在高高的山顶上，住着一棵古老的松树爷爷。无论是烈日还是暴雪，松树爷爷都笔直地站在那里。小鸟问他："您不累吗？"松树爷爷说："我的根深深地扎在岩石里，风吹不倒我，雪压不弯我。我要守护这座大山！"从此，所有的小动物都喜欢在松树爷爷的怀抱里休息。',
    knowledge: '松树是地球上最古老的树种之一！松树的叶子像针一样，叫做"针叶"，一年四季都是绿色的。松树能在岩石缝中生长，因为它的根非常强壮。松果里藏着松子，是很多小动物最爱的食物！',
    poem: '大雪压青松，青松挺且直。要知松高洁，待到雪化时。——陈毅《青松》\n\n松树教会我们：面对困难要像松树一样坚韧不拔！',
    quiz: [
      { question: '松树的叶子是什么形状？', options: ['圆形', '心形', '针形', '扇形'], answer: 2 },
      { question: '松树在什么季节落叶？', options: ['春天', '秋天', '冬天', '不落叶'], answer: 3 },
      { question: '松果里面有什么？', options: ['花粉', '松子', '蜂蜜', '树脂'], answer: 1 },
    ],
    scene: { name: '苍翠山林', description: '云雾缭绕的山峰上，松树成林地生长着。阳光透过层层松针洒下斑驳的光影，松鼠在树干上跳来跳去，收集松果。山间流淌着清澈的溪水，野花在松树的阴凉下静静开放。远处的山峰若隐若现，一只雄鹰在松林上空盘旋。' },
    stages: [
      { name: '松子', emoji: '🌰', description: '一颗小松子从松果中掉落到泥土里', unlockContent: '松子是非常有营养的坚果！' },
      { name: '发芽', emoji: '🌱', description: '小嫩芽顶着松子壳从土里钻出来', unlockContent: '松树种子需要经过寒冷才能更好发芽' },
      { name: '幼树', emoji: '🎄', description: '小松树像一棵迷你圣诞树', unlockContent: '松树每年大约长30-60厘米' },
      { name: '大树', emoji: '🌲', description: '松树长得又高又壮，枝繁叶茂', unlockContent: '松树可以活上千年！' },
      { name: '结松果', emoji: '🌰', description: '树上挂满了棕色的松果，松子等待播撒', unlockContent: '一棵松树每年可以产出几百个松果' },
    ],
    morphology: {
      overallForm: '常绿乔木，高可达30-45米，树冠圆锥形或伞形',
      flower: '雌雄同株，雄球花簇生枝端，黄色；雌球花单生或簇生，紫红色',
      fruit: '球果（松果），木质，卵形或圆锥形，成熟时鳞片张开释放种子',
      stem: '树干通直，树皮厚实纵裂，灰褐色，富含树脂',
      root: '主根深入岩层，侧根广布，可在岩石缝隙中扎根',
      rootType: '直根系',
      leaf: '针形叶，2-5针一束，长5-25厘米，常绿，表面有蜡质层减少水分蒸发',
      leafShape: '针形',
      growthData: '树高可达45m，寿命可超千年，年生长30-60cm，四季常绿',
    },
  },
  {
    id: 'chrysanthemum',
    name: '菊花',
    scientificName: 'Chrysanthemum morifolium',
    category: '草本植物',
    family: '菊科',
    environment: '喜凉爽气候，耐寒，短日照植物',
    features: '秋季盛开，花型多样，颜色丰富',
    emoji: '🏵️',
    color: 'sun',
    story: '深秋时节，百花纷纷凋谢，只有菊花妹妹"秋秋"在寒风中傲然绽放。"你为什么不怕冷呢？"落叶好奇地问。秋秋挺起胸膛说："因为我就是为秋天而生的呀！别的花有春天和夏天，而秋天是属于我的舞台！"从此，人们都说菊花是秋天最美的风景。',
    knowledge: '菊花是中国十大名花之一，也是"四君子"之一，象征隐逸、高洁。中国人赏菊、种菊已有三千多年历史！菊花品种超过三千种，按花型分有球形、扁形、丝状等多种。重阳节（农历九月初九）赏菊是中国的传统习俗。菊花茶清热明目，是很受欢迎的饮品。',
    poem: '采菊东篱下，悠然见南山。——陶渊明《饮酒》\n\n不是花中偏爱菊，此花开尽更无花。——元稹《菊花》',
    quiz: [
      { question: '菊花在什么季节盛开？', options: ['春天', '夏天', '秋天', '冬天'], answer: 2 },
      { question: '菊花属于"四君子"吗？', options: ['是', '不是', '不确定', '有时候是'], answer: 0 },
      { question: '重阳节有什么与菊花有关的习俗？', options: ['种菊花', '赏菊', '摘菊花', '画菊花'], answer: 1 },
    ],
    scene: { name: '秋日庭院', description: '深秋的庭院里，各色菊花争相绽放——金黄的、雪白的、紫红的、淡绿的，层层叠叠如锦缎铺展。古朴的篱笆旁，老人品着菊花茶，悠然自得。落叶金黄铺满小径，远处南山在薄雾中若隐若现，一派闲适恬淡的秋日景致。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '细小的菊花种子埋入秋日的土壤', unlockContent: '菊花也可以通过分株和扦插繁殖' },
      { name: '发芽', emoji: '🌱', description: '嫩绿的小苗从土中长出', unlockContent: '菊花幼苗喜欢凉爽的天气' },
      { name: '长叶', emoji: '🪴', description: '对生的叶片逐渐茂盛，形成丛状', unlockContent: '打顶可以让菊花长出更多分枝' },
      { name: '现蕾', emoji: '🌿', description: '枝头出现圆形的花蕾', unlockContent: '菊花是短日照植物，日照变短才会开花' },
      { name: '盛放', emoji: '🏵️', description: '饱满的花朵层层绽放，金秋添色', unlockContent: '一朵菊花其实由上百朵小花组成！' },
    ],
    morphology: {
      overallForm: '多年生草本，株高30-150厘米，茎直立，基部半木质化',
      flower: '头状花序，直径2.5-20厘米，由舌状花和管状花组成，花色极丰富，花型多样',
      fruit: '瘦果，倒卵形至圆柱形，极小，顶端无冠毛或有短冠毛',
      stem: '直立茎，绿色或紫色，基部木质化，上部多分枝，被灰白色柔毛',
      root: '须根系，根系浅而密集，主要分布在土壤表层20厘米内',
      rootType: '须根系',
      leaf: '互生，卵形至披针形，叶缘有粗锯齿或深裂，叶背灰白色被毛',
      leafShape: '卵形/掌状深裂',
      growthData: '株高30-150cm，花期9-11月，适温18-22℃，短日照开花',
    },
  },
];
