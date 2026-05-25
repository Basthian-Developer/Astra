import { defineStore } from 'pinia'
import { supabase } from '../libs/supabase'

export const NovelasPublicas = defineStore('novelasPublicas', {

    state: () => ({
        novelasPublicas: []
    }),

    actions: {

        async getNovelas(forzar = false) {

            // cache global
            if (this.novelasPublicas.length && !forzar)
                return this.novelasPublicas

            const { data, error } = await supabase
                .from('novelas_publicas')
                .select('*')

            if (error) throw error

            const novelas = data.map((n) => ({
                ...n,
                year: new Date(n.created_at).getFullYear(),
                estadoEmisionText: {
                    emision: 'Emisión',
                    proximamente: 'Próximamente',
                    cancelado: 'Cancelado'
                }[n.desc_estado]
            }))

            this.novelasPublicas = novelas

            return this.novelasPublicas
        },

        getPortada(fileName) {

            if (!fileName)
                return '/placeholder.jpg'

            return supabase.storage
                .from('portadas')
                .getPublicUrl(fileName)
                .data.publicUrl
        },

        async getNovelaBySlug(slug) {

            const novelaFiltrada = this.novelasPublicas.find(n => n.slug === slug)

            if (novelaFiltrada) return novelaFiltrada

            const { data, error } = await supabase
                .from('novelas_publicas')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error) throw error

            const novela = {
                ...data,
                year: new Date(data.created_at).getFullYear(),
                estadoEmisionText: {
                    emision: 'En emisión',
                    proximamente: 'Próximamente',
                    cancelado: 'Cancelado'
                }[data.desc_estado]
            }

            return novela
        }
    }
})