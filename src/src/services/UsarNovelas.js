import { supabase } from '../libs/supabase.js'
import { ref } from 'vue'

export function UsarNovelas() {
    const novelas = ref([])

    const getNovelas = async () => {
        if (novelas.value.length) return novelas.value

        const { data, error } = await supabase
            .from('novelas')
            .select('*')

        if (error) throw error

        novelas.value = data

        return novelas.value
    }

    const getPortada = (fileName) => {
        if (!fileName) return '/placeholder.jpg'

        return supabase.storage
            .from('portadas')
            .getPublicUrl(fileName)
            .data.publicUrl
    }

    return {
        novelas,
        getNovelas,
        getPortada
    }
}