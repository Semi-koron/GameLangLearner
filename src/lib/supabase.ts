import { createClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadAvatar(formData: FormData) {
    const { data, error } = await fetch(baseUrl + "upload-avatar", {
        method: "POST",
        body: formData,
    }).then((res) => res.json());
    
    return { data, error };
}

export async function signUp(email: string, password: string, userName: string) {
    const data = await fetch(baseUrl + "user-create", {
        method: "POST",
        body: JSON.stringify({ email, password, userName }),
    }).then((res) => res.json());

    return data;
}