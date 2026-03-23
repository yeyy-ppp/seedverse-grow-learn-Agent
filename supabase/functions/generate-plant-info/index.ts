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
    const { plantName, scientificName, category, family } = await req.json();
    if (!plantName) {
      return new Response(JSON.stringify({ error: '请提供植物名称' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

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
            content: `你是一个儿童植物教育专家。请根据提供的植物信息，生成适合儿童的教育内容。所有内容需要简单、生动、富有想象力。请返回JSON格式。`,
          },
          {
            role: 'user',
            content: `请为植物"${plantName}"（学名：${scientificName || '未知'}，分类：${category || '未知'}，科属：${family || '未知'}）生成以下内容：
1. emoji: 最适合代表这种植物的emoji（1个）
2. environment: 生长环境描述（一句话）
3. features: 主要特征（一句话）
4. story: 一个有趣的拟人化儿童故事（100字左右）
5. knowledge: 科普知识讲解（80字左右）
6. poem: 相关诗词或童谣（含出处或原创）
7. quiz: 3道选择题，每题4个选项，标明正确答案索引
8. scene: 一个相关的情境场景（name + description）
9. stages: 5个生命周期阶段（种子→发芽→生长→开花→结果），每个阶段包含name, emoji, description, unlockContent`,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_plant_content',
              description: 'Generate educational content for a plant',
              parameters: {
                type: 'object',
                properties: {
                  emoji: { type: 'string' },
                  environment: { type: 'string' },
                  features: { type: 'string' },
                  story: { type: 'string' },
                  knowledge: { type: 'string' },
                  poem: { type: 'string' },
                  quiz: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        question: { type: 'string' },
                        options: { type: 'array', items: { type: 'string' } },
                        answer: { type: 'number' },
                      },
                      required: ['question', 'options', 'answer'],
                    },
                  },
                  scene: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                    },
                    required: ['name', 'description'],
                  },
                  stages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        emoji: { type: 'string' },
                        description: { type: 'string' },
                        unlockContent: { type: 'string' },
                      },
                      required: ['name', 'emoji', 'description', 'unlockContent'],
                    },
                  },
                },
                required: ['emoji', 'environment', 'features', 'story', 'knowledge', 'poem', 'quiz', 'scene', 'stages'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'generate_plant_content' } },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      throw new Error('AI内容生成失败');
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('AI未返回内容');

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-plant-info error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : '生成失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
