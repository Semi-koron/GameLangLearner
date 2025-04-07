import { createClient } from "@supabase/supabase-js";

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

export async function fetchUser(token: string) {
    if (!token) {
        return null;
    }

    const data = await fetch(baseUrl + "fetch-userdata", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());

    return data;
}


export async function textDetect (file: File, token: string) {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(baseUrl + "gemini-image-recognition", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    }
    throw new Error(data.error || "Unknown error");
}