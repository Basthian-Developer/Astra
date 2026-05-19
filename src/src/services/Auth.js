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

    const obtenerRol = async (id) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', id)
            .maybeSingle()

        if (error) throw error

        return data?.rol
    }

    return {
        register,
        login,
        logout,
        obtenerRol
    }
}