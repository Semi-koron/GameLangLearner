// authMiddleware.ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

export async function withAuth(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Unauthorized: No token provided' };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseClient.auth.getUser(token);

  if (error) {
    return { user: null, error: 'Unauthorized: Invalid token' };
  }

  return { user: data.user, error: null };
}
