import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Search, Loader2, Plus, Sparkles } from 'lucide-react';
import { plants, Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PlantDetailView from '@/components/identify/PlantDetailView';
import QuizItem from '@/components/identify/QuizItem';

const IdentifyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [identified, setIdentified] = useState<Plant | null>(null);
  const [aiResult, setAiResult] = useState<{ name: string; description: string } | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { collectSeed, getSeed, addCustomPlant, getAllPlants, customPlants } = useSeedVerse();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Pending AI data for "add to collection" flow
  const [pendingAiData, setPendingAiData] = useState<any>(null);

  const allPlants = getAllPlants();
  const filteredPlants = allPlants.filter(p =>
    p.name.includes(searchQuery) || p.category.includes(searchQuery)
  );

  const handleIdentify = (plant: Plant) => {
    setIdentified(plant);
    collectSeed(plant.id);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateAndAddPlant = async (name: string, scientificName?: string, category?: string, family?: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-plant-info', {
        body: { plantName: name, scientificName, category, family },
      });
      if (error) throw error;

      const plantId = `custom-${name}-${Date.now()}`;
      const newPlant = {
        id: plantId,
        name,
        scientificName: scientificName || '未知',
        category: category || '未知',
        family: family || '未知',
        environment: data.environment,
        features: data.features,
        emoji: data.emoji || '🌿',
        color: 'leaf',
        story: data.story,
        knowledge: data.knowledge,
        poem: data.poem,
        quiz: data.quiz || [],
        scene: data.scene || { name: '自然', description: '大自然中的美丽植物' },
        stages: data.stages || [
          { name: '种子', emoji: '🫘', description: '一颗小种子', unlockContent: '种子是生命的开始' },
          { name: '发芽', emoji: '🌱', description: '嫩芽破土而出', unlockContent: '发芽需要水和阳光' },
          { name: '生长', emoji: '🪴', description: '植物茁壮成长', unlockContent: '植物通过光合作用生长' },
          { name: '开花', emoji: '🌼', description: '美丽的花朵绽放', unlockContent: '花朵吸引昆虫传粉' },
          { name: '结果', emoji: '🌰', description: '果实成熟了', unlockContent: '果实里有新的种子' },
        ],
      };

      addCustomPlant(newPlant);
      toast({ title: `🌱 ${name} 已加入种子图鉴！`, description: 'AI已为你生成完整的植物知识卡片' });
      setAiResult(null);
      setPendingAiData(null);
      setPreviewUrl(null);
      setIdentified(newPlant as Plant);
    } catch (e) {
      console.error('Generate error:', e);
      toast({ title: '生成失败', description: '请稍后重试', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const identifyFromImage = async (file: File) => {
    setIsIdentifying(true);
    setPreviewUrl(URL.createObjectURL(file));
    setAiResult(null);
    setPendingAiData(null);

    try {
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke('identify-plant', {
        body: { imageBase64: base64 },
      });
      if (error) throw error;

      if (data.matched_id) {
        const matched = plants.find(p => p.id === data.matched_id);
        if (matched) {
          handleIdentify(matched);
          setIsIdentifying(false);
          setPreviewUrl(null);
          return;
        }
      }

      // Store pending AI data for potential addition
      setPendingAiData(data);
      setAiResult({
        name: data.name,
        description: `${data.name}（${data.scientificName}）\n分类：${data.category}\n科属：${data.family}\n\n${data.description}`,
      });

      toast({
        title: `🌿 识别成功：${data.name}`,
        description: '点击"加入图鉴"可将此植物收录到你的种子图鉴中！',
      });
    } catch (e) {
      console.error('Identify error:', e);
      toast({ title: '识别失败', description: '请重新拍照或上传图片试试', variant: 'destructive' });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) identifyFromImage(file);
    e.target.value = '';
  };

  const handleSearchAdd = () => {
    if (!searchQuery.trim()) return;
    // Check if already exists
    const exists = allPlants.find(p => p.name === searchQuery.trim());
    if (exists) {
      handleIdentify(exists as Plant);
      return;
    }
    generateAndAddPlant(searchQuery.trim());
  };

  if (identified) {
    return <PlantDetailView plant={identified} onBack={() => setIdentified(null)} />;
  }

  return (
    <div className="min-h-screen pb-24">
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="gradient-sky-bg pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">🔍 植物识别</h1>
        <p className="text-sm text-foreground/60">拍照识别或搜索添加新植物</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => cameraInputRef.current?.click()} disabled={isIdentifying || isGenerating} className="btn-nature text-sm flex items-center gap-2">
            <Camera size={16} /> 拍照识别
          </button>
          <button onClick={() => uploadInputRef.current?.click()} disabled={isIdentifying || isGenerating} className="btn-sun text-sm flex items-center gap-2">
            <Upload size={16} /> 上传图片
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Identifying state */}
        {isIdentifying && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-nature p-6 text-center space-y-3">
            {previewUrl && <img src={previewUrl} alt="识别中" className="w-32 h-32 object-cover rounded-2xl mx-auto" />}
            <Loader2 className="animate-spin mx-auto text-primary" size={32} />
            <p className="text-sm text-muted-foreground">AI正在识别植物...</p>
          </motion.div>
        )}

        {/* Generating state */}
        {isGenerating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-nature p-6 text-center space-y-3">
            <Sparkles className="animate-spin mx-auto text-sun" size={32} />
            <p className="text-sm text-muted-foreground">AI正在生成植物知识卡片...</p>
            <p className="text-xs text-muted-foreground">包括故事、诗词、问答和生命周期</p>
          </motion.div>
        )}

        {/* AI result for unknown plant - with "Add to collection" button */}
        {aiResult && !identified && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-nature p-4 space-y-3">
            <div className="flex items-center gap-3">
              {previewUrl && <img src={previewUrl} alt={aiResult.name} className="w-16 h-16 object-cover rounded-xl" />}
              <div>
                <h3 className="font-bold text-foreground text-lg">🌿 {aiResult.name}</h3>
                <p className="text-xs text-muted-foreground">AI识别结果</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{aiResult.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => generateAndAddPlant(
                  pendingAiData?.name || aiResult.name,
                  pendingAiData?.scientificName,
                  pendingAiData?.category,
                  pendingAiData?.family,
                )}
                className="btn-nature text-xs flex items-center gap-1 flex-1"
              >
                <Plus size={14} /> 加入种子图鉴
              </button>
              <button onClick={() => { setAiResult(null); setPreviewUrl(null); setPendingAiData(null); }} className="btn-sun text-xs flex-1">
                继续识别
              </button>
            </div>
          </motion.div>
        )}

        {/* Search with add capability */}
        {!isIdentifying && !aiResult && !isGenerating && (
          <>
            <div className="glass-card p-3 flex items-center gap-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索或输入新植物名称..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
                onKeyDown={e => { if (e.key === 'Enter') handleSearchAdd(); }}
              />
              {searchQuery.trim() && !allPlants.find(p => p.name === searchQuery.trim()) && (
                <button onClick={handleSearchAdd} className="bg-leaf text-primary-foreground rounded-xl px-3 py-1 text-xs font-bold whitespace-nowrap flex items-center gap-1">
                  <Plus size={12} /> 添加
                </button>
              )}
            </div>

            {/* Show search hint when no exact match */}
            {searchQuery.trim() && filteredPlants.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-nature p-4 text-center space-y-2">
                <p className="text-sm text-foreground font-bold">🔍 未找到"{searchQuery}"</p>
                <p className="text-xs text-muted-foreground">点击"添加"按钮，AI将自动生成该植物的知识卡片并加入你的图鉴！</p>
              </motion.div>
            )}

            {/* Plant grid - show all including custom */}
            <div className="grid grid-cols-3 gap-2">
              {filteredPlants.map(plant => (
                <motion.button
                  key={plant.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIdentify(plant as Plant)}
                  className="card-nature p-3 flex flex-col items-center gap-1"
                >
                  <span className="text-3xl">{plant.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{plant.name}</span>
                  {getSeed(plant.id) && <span className="text-[8px] text-leaf font-bold">✓ 已收集</span>}
                  {plant.id.startsWith('custom-') && <span className="text-[8px] text-sun font-bold">AI生成</span>}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdentifyPage;
