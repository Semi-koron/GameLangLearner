import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SERVICE_ROLE_KEY') ?? '' // サービスロールキーを使う
);

console.log("User Create");

Deno.serve(async (req) => {
  // サインアップの際にAuthorizationヘッダーが必要ないのでチェックをスキップ
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, password, userName } = await req.json();

    if (!email || !password || !userName) {
      return new Response(JSON.stringify({ error: "Email, Password, and UserName are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ユーザー作成
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (authError || !authData?.user) {
      throw new Error(authError?.message || "User sign-up failed");
    }

    const userId = authData.user.id;

    // user_table にユーザー情報を追加
    const { error: insertError } = await supabaseClient
      .from("user_table")
      .insert([{ user_id: userId, user_name: userName }]);

    if (insertError) {
      throw new Error(insertError.message);
    }

    return new Response(JSON.stringify({ message: "User created successfully", token: authData.session.access_token }), {
      status: 200,
      body: JSON.stringify({ user: authData.user }),
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
