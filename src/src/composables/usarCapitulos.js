import { ref } from 'vue'

const capitulos = ref([])

export function usarCapitulos() {
    const cargarCapitulos = async () => {
        if (capitulos.value.length) return;  // Evita llamadas múltiples simultáneas

        const res = await fetch('documentos/jsons/capitulos.json', {
            cache: 'no-store',  // Ignora cache del navegador
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        const data = await res.json();
        capitulos.value = data;
    };

    const obtenerCapitulosByNovela = (novelaId) => {
        return capitulos.value.filter(capitulo => capitulo.novelaId === novelaId);
    };

    return {
        capitulos,
        cargarCapitulos,
        obtenerCapitulosByNovela
    }
}