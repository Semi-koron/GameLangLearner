// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { withAuth } from '../_shared/authMiddleware.ts'; // ミドルウェアのインポート

function base64Encode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }


  const { user, error } = await withAuth(req);
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // 画像取得
  const formData = await req.formData();
  const image = formData.get('image');
  if (!image || !(image instanceof File)) {
    return new Response(JSON.stringify({ error: 'Image not found or invalid' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Base64変換（安全）
  const arrayBuffer = await image.arrayBuffer();
  const base64String = base64Encode(arrayBuffer);
  
  // Gemini APIキーのチェック
  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API key not found' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "contents": [{
        "parts":[{
          "text": "日本語で答えてください。画像になにがうつっているかという事のみ答えてください。",
        },
        {
          "inline_data": {
            "mime_type":"image/jpeg",
            "data": base64String
          }
        }
      ]
    }]
  }),
  };
  const response = await fetch(fetchUrl, fetchOptions);
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  return new Response(JSON.stringify(text), {
    status: 200,
    headers: {...corsHeaders, 'Content-Type': 'application/json' },
  });
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/gemini-image-recognition' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
