import { supabase } from "./supabase";

async function signUpNewUser(mail:string, password:string ) {
    const { data, error } = await supabase.auth.signUp({
      email: mail,
      password: password,
    })
    return {data, error}
}

async function login(mail:string, password:string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: mail,
        password: password
    })
    return {data, error}
}

async function tokenCheck(token:string) {
  return await supabase.auth.getUser(token);
}

export { signUpNewUser, login, tokenCheck }