import { ref } from 'vue'

const novelas = ref([])

export function usarNovelas() {
    const cargarNovelas = async () => {
        if (novelas.value.length) return;  // Solo evita llamadas múltiples simultáneas

        const res = await fetch('documentos/jsons/novelas.json', {
            cache: 'no-store',  // Ignora cache del navegador completamente
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        const data = await res.json();
        novelas.value = data;
    };

    return {
        novelas,
        cargarNovelas
    }
}