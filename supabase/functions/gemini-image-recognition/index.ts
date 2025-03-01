// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { withAuth } from '../_shared/authMiddleware.ts'; // ミドルウェアのインポート

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

Deno.serve(async (req: Request) => {
  const { user, error } = await withAuth(req);

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 401,
      headers: {...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API key not found' }), {
      status: 500,
      headers: {...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  // 認証済みユーザーの処理
  const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "contents": [{
        "parts":[{"text": "Write a story about a magic backpack."}]
        }]
       }),
  };
  const response = await fetch(fetchUrl, fetchOptions);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
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
