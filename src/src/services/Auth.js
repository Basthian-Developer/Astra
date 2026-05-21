import { defineStore } from 'pinia'
import { supabase } from '../libs/supabase.js'

export const Auth = defineStore('auth', {
    state: () => ({
        usuario: null,
        rol: null,
        loading: false
    }),
    actions: {
        async register(email, password) {
            try {
                this.loading = true

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                })

                this.loading = false

                if (error) throw error

                this.usuario = data.user

                return data
            } finally {
                this.loading = false
            }
        },

        async login(email, password) {
            try {
                this.loading = true

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                this.loading = false

                if (error) throw error

                this.usuario = data.user

                await this.getRol(data.user.id)

                return data
            }finally{
                this.loading = false
            }
        },
        async logout() {
            await supabase.auth.signOut()
            this.usuario = null
            this.rol = null
        },
        async getRol(id) {
            if (this.rol) return this.rol

            const { data, error } = await supabase
                .from('profiles')
                .select('rol')
                .eq('id', id)
                .maybeSingle()

            if (error) throw error

            this.rol = data?.rol

            return this.rol
        }
    }
})

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