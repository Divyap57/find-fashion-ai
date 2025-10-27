import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('Received image search request');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');

    if (!LOVABLE_API_KEY || !RAPIDAPI_KEY) {
      throw new Error('Required API keys not configured');
    }

    // Step 1: Analyze image with Lovable AI
    console.log('Analyzing image with AI...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this fashion item and extract: 1) Item type (e.g., dress, shoes, bag), 2) Color, 3) Style/pattern, 4) Key features. Return ONLY a concise search query for an e-commerce API (max 5 words).'
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI analysis failed:', errorText);
      throw new Error('Failed to analyze image');
    }

    const aiData = await aiResponse.json();
    const searchQuery = aiData.choices[0].message.content.trim();
    console.log('AI search query:', searchQuery);

    // Step 2: Search products from Amazon
    console.log('Searching products from Amazon...');
    
    const amazonResponse = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&country=US&category_id=aps`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
      }
    );

    const products: any[] = [];

    // Process Amazon results
    if (amazonResponse.ok) {
      const amazonData = await amazonResponse.json();
      console.log('Found Amazon products:', amazonData.data?.products?.length || 0);
      
      const amazonProducts = (amazonData.data?.products || []).slice(0, 20).map((item: any) => ({
        id: `amazon-${item.asin}`,
        title: item.product_title,
        price: item.product_price || 'Price not available',
        image: item.product_photo,
        link: item.product_url,
        platform: 'Amazon',
        rating: item.product_star_rating || 0,
        reviews: item.product_num_ratings || 0
      }));
      
      products.push(...amazonProducts);
    } else {
      console.error('Amazon search failed:', await amazonResponse.text());
    }

    console.log('Total products found:', products.length);

    return new Response(
      JSON.stringify({ products, searchQuery }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in search-products:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        products: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
