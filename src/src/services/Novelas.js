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

        async uploadPortada(file) {

            if (!file)
                throw new Error('No se proporcionó ninguna imagen')

            // Obtener extensión
            const extension = file.name.split('.').pop()

            // Generar UUID
            const uuid = crypto.randomUUID()

            // Nombre final
            const nombreArchivo = `${uuid}.${extension}`

            const { data, error } = await supabase.storage
                .from('portadas')
                .upload(nombreArchivo, file)

            if (error)
                throw error

            return data.path
        },

        async createNovela(novelaNueva) {
            const { data, error } = await supabase
                .from('novelas')
                .insert([novelaNueva])
                .select()

            if (error) throw error

            this.novelas.push(data[0])

            return data[0]
        },

        async eliminarById(id) {
            const novela = this.novelas.find(n => n.id === id)

            if (!novela) throw new Error('No se encontro la novela')

            if (novela.imagen) {
                const { error: storageError } = await supabase.storage
                    .from('portadas')
                    .remove([novela.imagen])

                if (storageError)
                    throw storageError
            }

            const { data, error } = await supabase
                .from('novelas')
                .delete()
                .eq('id', id)

            if (error) throw error

            this.novelas = this.novelas.filter(n => n.id !== id)
        }
    }
})