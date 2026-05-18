import { supabase } from '../libs/supabase.js'

export function UsarSupabase() {
    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) throw error

        return data
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        return data
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return {
        register,
        login,
        logout
    }
}