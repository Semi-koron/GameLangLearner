// authMiddleware.ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

export async function uploadImage(tableName: string, path: string, file: File) {    
    return { data, error } = await supabase.storage.from(`${tableName}`).upload(`${path}`, file);
}
