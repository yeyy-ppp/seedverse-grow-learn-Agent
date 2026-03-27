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
    id: 'tomato',
    name: '番茄',
    scientificName: 'Solanum lycopersicum',
    category: '蔬菜',
    family: '茄科',
    environment: '喜欢温暖、光照充足的环境，需要充足水分',
    features: '红色果实，多汁酸甜，富含维生素C',
    emoji: '🍅',
    color: 'fruit',
    story: '在一个阳光明媚的菜园里，住着一位叫"红红"的小番茄。红红小时候穿着绿色的衣服，他一直很好奇："为什么大家都说我是红色的呢？"等到夏天来了，红红的衣服慢慢从绿色变成了黄色，再变成了橙色，最后变成了鲜艳的红色。红红终于明白了：原来成长就是一个美丽的变色过程！',
    knowledge: '番茄原产于南美洲，曾经人们以为它有毒不敢吃！直到一位勇敢的人第一个尝试吃番茄，大家才发现它是如此美味。番茄富含番茄红素和维生素C，对身体非常有益。番茄既可以当水果吃，也可以当蔬菜做菜！',
    poem: '小小番茄圆又圆，红红绿绿挂满园。酸甜可口味道美，维C丰富保健康。\n\n番茄告诉我们：每个人都有自己独特的成长节奏！',
    quiz: [
      { question: '番茄原产于哪里？', options: ['中国', '欧洲', '南美洲', '非洲'], answer: 2 },
      { question: '番茄成熟时是什么颜色？', options: ['绿色', '蓝色', '红色', '紫色'], answer: 2 },
      { question: '番茄富含什么维生素？', options: ['维生素A', '维生素B', '维生素C', '维生素D'], answer: 2 },
    ],
    scene: { name: '阳光菜园', description: '温暖的阳光洒在整齐的菜园里，一排排番茄架上挂满了红红绿绿的果实。勤劳的小蜜蜂在黄色的小花间穿梭，菜园旁边有一座小水车，清澈的溪水顺着水渠流淌。篱笆上爬满了牵牛花，远处的稻草人戴着草帽微笑着。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '扁平的小种子被种在温暖的土壤里', unlockContent: '一个番茄里可以有200多颗种子！' },
      { name: '发芽', emoji: '🌱', description: '两片可爱的子叶从土里冒出来', unlockContent: '番茄种子7-14天就能发芽' },
      { name: '生长', emoji: '🪴', description: '茎叶茂盛生长，开始需要支架支撑', unlockContent: '番茄的茎有特殊的气味可以驱虫' },
      { name: '开花', emoji: '🌼', description: '黄色的小花朵一簇簇地开放', unlockContent: '番茄花可以自花授粉，不需要蜜蜂帮忙' },
      { name: '结果', emoji: '🍅', description: '绿色的小果实慢慢变红，成为美味的番茄', unlockContent: '番茄从开花到成熟需要45-60天' },
    ],
    morphology: {
      overallForm: '一年生或多年生草本，高0.6-2米，全株被腺毛，有特殊气味',
      flower: '聚伞花序，黄色小花，5-6瓣，直径1-2厘米，花柱突出',
      fruit: '浆果，球形或扁球形，直径3-8厘米，成熟时由绿转红，多汁',
      stem: '半蔓性茎，圆形，绿色带紫，表面密被腺毛，需支架支撑',
      root: '主根可入土1.5米，根系横向扩展范围大，再生能力强',
      rootType: '直根系',
      leaf: '互生，奇数羽状复叶，小叶卵形，叶缘有不规则锯齿，被腺毛',
      leafShape: '羽状复叶',
      growthData: '生长周期90-150天，株高0.6-2m，花期5-8月，适温20-28℃',
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
    id: 'strawberry',
    name: '草莓',
    scientificName: 'Fragaria × ananassa',
    category: '水果',
    family: '蔷薇科',
    environment: '喜凉爽气候，需要充足阳光和排水良好的土壤',
    features: '鲜红色心形果实，表面有小颗粒，酸甜可口',
    emoji: '🍓',
    color: 'petal',
    story: '在一片绿油油的田野里，住着一群可爱的小草莓。它们穿着红色的小裙子，头上戴着绿色的小帽子。最小的草莓"甜甜"总是好奇地问妈妈："为什么我们身上有这么多小点点？"妈妈笑着说："那些是我们的小种子宝宝呀！每一颗小点点都能长出一株新的草莓呢！"',
    knowledge: '草莓是唯一一种种子长在外面的水果！我们看到草莓表面的小颗粒其实就是它的种子，一颗草莓上大约有200颗小种子。草莓富含维生素C，比橙子还多！草莓的名字来源于古时候人们用稻草铺在草莓下面防止果实烂掉。',
    poem: '小小草莓红艳艳，甜甜蜜蜜像心形。一颗一颗排排站，吃在嘴里甜在心。\n\n草莓教会我们：美好的事物需要耐心等待！',
    quiz: [
      { question: '草莓的种子长在哪里？', options: ['里面', '根部', '外面', '叶子上'], answer: 2 },
      { question: '草莓富含什么维生素？', options: ['维生素A', '维生素B', '维生素C', '维生素K'], answer: 2 },
      { question: '草莓属于哪个科？', options: ['菊科', '蔷薇科', '百合科', '茄科'], answer: 1 },
    ],
    scene: { name: '浆果花园', description: '一片阳光普照的草莓园里，绿叶间探出无数红红的草莓。白色的小花和红色的果实交相辉映，空气中弥漫着甜蜜的香气。蝴蝶在花丛中翩翩起舞，一只小瓢虫停在草莓叶上，享受着温暖的午后。' },
    stages: [
      { name: '种子', emoji: '🫘', description: '细小的种子被种在肥沃的土壤中', unlockContent: '一颗草莓上约有200颗种子！' },
      { name: '发芽', emoji: '🌱', description: '三片小叶子的幼苗冒出地面', unlockContent: '草莓种子发芽需要光照帮助' },
      { name: '走茎', emoji: '🪴', description: '草莓长出匍匐茎，像藤蔓一样蔓延', unlockContent: '草莓通过走茎可以无限繁殖！' },
      { name: '开花', emoji: '🤍', description: '洁白的五瓣小花在绿叶中绽放', unlockContent: '草莓花需要蜜蜂帮忙授粉' },
      { name: '结果', emoji: '🍓', description: '红红的心形果实挂满了枝头', unlockContent: '草莓从开花到成熟只要30天' },
    ],
    morphology: {
      overallForm: '多年生草本，株高10-40厘米，匍匐茎蔓延繁殖',
      flower: '聚伞花序，白色五瓣花，直径1.5-2厘米，花心黄色，两性花',
      fruit: '聚合果，由膨大花托发育而成，表面嵌有200多颗瘦果（小种子）',
      stem: '短缩茎近地面，匍匐茎（走茎）可达1米长，节上生根繁殖',
      root: '须根系，主根不明显，大量须根分布在20厘米土层内',
      rootType: '须根系',
      leaf: '基生，三出复叶，小叶倒卵形，叶缘有锯齿，叶面被毛',
      leafShape: '三出复叶/倒卵形',
      growthData: '株高10-40cm，花期4-5月，果期5-7月，适温15-25℃',
    },
  },
];
