import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { plants, Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PlantDetailView from '@/components/identify/PlantDetailView';
import QuizItem from '@/components/identify/QuizItem';

const IdentifyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [identified, setIdentified] = useState<Plant | null>(null);
  const [aiResult, setAiResult] = useState<{ name: string; description: string } | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { collectSeed, getSeed } = useSeedVerse();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const filteredPlants = plants.filter(p =>
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

  const identifyFromImage = async (file: File) => {
    setIsIdentifying(true);
    setPreviewUrl(URL.createObjectURL(file));
    setAiResult(null);

    try {
      const base64 = await fileToBase64(file);

      const { data, error } = await supabase.functions.invoke('identify-plant', {
        body: { imageBase64: base64 },
      });

      if (error) throw error;

      // Check if it matches a known plant
      if (data.matched_id) {
        const matched = plants.find(p => p.id === data.matched_id);
        if (matched) {
          handleIdentify(matched);
          setIsIdentifying(false);
          setPreviewUrl(null);
          return;
        }
      }

      // Show AI result for unknown plants
      setAiResult({
        name: data.name,
        description: `${data.name}（${data.scientificName}）\n分类：${data.category}\n科属：${data.family}\n\n${data.description}`,
      });

      toast({
        title: `🌿 识别成功：${data.name}`,
        description: data.matched_id
          ? '已匹配到种子图鉴中的植物！'
          : '这种植物还不在种子图鉴中，继续探索吧！',
      });
    } catch (e) {
      console.error('Identify error:', e);
      toast({
        title: '识别失败',
        description: '请重新拍照或上传图片试试',
        variant: 'destructive',
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) identifyFromImage(file);
    e.target.value = '';
  };

  if (identified) {
    return (
      <PlantDetailView
        plant={identified}
        onBack={() => setIdentified(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="gradient-sky-bg pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">🔍 植物识别</h1>
        <p className="text-sm text-foreground/60">拍照或上传图片，AI帮你认识新植物</p>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isIdentifying}
            className="btn-nature text-sm flex items-center gap-2"
          >
            <Camera size={16} /> 拍照识别
          </button>
          <button
            onClick={() => uploadInputRef.current?.click()}
            disabled={isIdentifying}
            className="btn-sun text-sm flex items-center gap-2"
          >
            <Upload size={16} /> 上传图片
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Identifying state */}
        {isIdentifying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-nature p-6 text-center space-y-3"
          >
            {previewUrl && (
              <img src={previewUrl} alt="识别中" className="w-32 h-32 object-cover rounded-2xl mx-auto" />
            )}
            <Loader2 className="animate-spin mx-auto text-primary" size={32} />
            <p className="text-sm text-muted-foreground">AI正在识别植物...</p>
          </motion.div>
        )}

        {/* AI result for unknown plant */}
        {aiResult && !identified && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-nature p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img src={previewUrl} alt={aiResult.name} className="w-16 h-16 object-cover rounded-xl" />
              )}
              <div>
                <h3 className="font-bold text-foreground text-lg">🌿 {aiResult.name}</h3>
                <p className="text-xs text-muted-foreground">AI识别结果</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {aiResult.description}
            </p>
            <p className="text-xs text-leaf font-semibold">
              💡 这种植物暂未收录到种子图鉴，快去探索更多植物吧！
            </p>
            <button
              onClick={() => { setAiResult(null); setPreviewUrl(null); }}
              className="btn-nature text-xs"
            >
              继续识别
            </button>
          </motion.div>
        )}

        {/* Search */}
        {!isIdentifying && !aiResult && (
          <>
            <div className="glass-card p-3 flex items-center gap-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索植物名称..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
              />
            </div>

            {/* Plant grid */}
            <div className="grid grid-cols-3 gap-2">
              {filteredPlants.map(plant => (
                <motion.button
                  key={plant.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIdentify(plant)}
                  className="card-nature p-3 flex flex-col items-center gap-1"
                >
                  <span className="text-3xl">{plant.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{plant.name}</span>
                  {getSeed(plant.id) && <span className="text-[8px] text-leaf font-bold">✓ 已收集</span>}
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
