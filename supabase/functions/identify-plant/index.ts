import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: '请提供图片' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Known plants in our database
    const knownPlants = ['向日葵', '荷花', '梅花', '竹子', '桃花', '草莓'];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `你是一个植物识别专家。请识别图片中的植物，并返回JSON格式结果。
我们系统中已有的植物列表：${knownPlants.join('、')}。
如果图片中的植物与列表中的某一种匹配或接近，请在matched_id字段返回对应的拼音id（sunflower=向日葵, lotus=荷花, plum=梅花, bamboo=竹子, peach=桃花, strawberry=草莓）。
如果不匹配任何已知植物，matched_id返回null。`,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: '请识别这张图片中的植物' },
              { type: 'image_url', image_url: { url: imageBase64 } },
            ],
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'identify_plant',
              description: 'Return plant identification result',
              parameters: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: '植物中文名' },
                  scientificName: { type: 'string', description: '植物学名' },
                  category: { type: 'string', description: '分类（如草本植物、木本植物等）' },
                  family: { type: 'string', description: '科属' },
                  confidence: { type: 'number', description: '识别置信度0-1' },
                  matched_id: { type: 'string', nullable: true, description: '匹配到的系统内植物id（sunflower/lotus/plum/bamboo/peach/strawberry），没有则null' },
                  description: { type: 'string', description: '简短描述，适合儿童阅读' },
                },
                required: ['name', 'scientificName', 'category', 'family', 'confidence', 'matched_id', 'description'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'identify_plant' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: '请求太频繁，请稍后再试' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI额度不足' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      throw new Error('AI识别失败');
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('AI未返回识别结果');
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('identify-plant error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : '识别失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
