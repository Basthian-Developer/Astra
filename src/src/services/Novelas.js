import { defineStore } from 'pinia'
import { supabase } from '../libs/supabase'

export const Novelas = defineStore('novelas', {

    state: () => ({
        novelas: []
    }),

    actions: {

        async getNovelas(forzar = false) {

            // cache global
            if (this.novelas.length && !forzar)
                return this.novelas

            const { data, error } = await supabase
                .from('novelas')
                .select('*')

            if (error) throw error

            this.novelas = data

            return this.novelas
        },

        getPortada(fileName) {

            if (!fileName)
                return '/placeholder.jpg'

            return supabase.storage
                .from('portadas')
                .getPublicUrl(fileName)
                .data.publicUrl
        },

        async eliminarById(id){
            const {data, error} = await supabase
            .from('novelas')
            .delete()
            .eq('id', id)

            if(error) throw error

            this.novelas = this.novelas.filter(n => n.id !== id)
        }
    }
})