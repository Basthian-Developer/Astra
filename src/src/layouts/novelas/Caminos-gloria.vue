<script setup>
import { ref, onMounted, computed } from 'vue'
import NovelLanding from '../../components/Novela.vue'

import { usarNovelas } from '../../composables/usarNovelas'
import { usarCapitulos } from '../../composables/usarCapitulos'

const { novelas, cargarNovelas } = usarNovelas()
const { cargarCapitulos, obtenerCapitulosByNovela } = usarCapitulos()
const novela = ref(null)
const capitulosNovela = ref([])
const capitulos = computed(() => capitulosNovela.value)

onMounted(async () => {
  await cargarNovelas()
  novela.value = novelas.value[2]
  await cargarCapitulos()
  capitulosNovela.value = obtenerCapitulosByNovela(novela.value.id)
})
</script>

<template>
  <NovelLanding 
    v-if="novela"
    :title="novela.titulo"
    :author="novela.autor"
    :status="novela.estado"
    :coverImage="novela.imagen"
    :synopsis="novela.info.sinopsis"
    :tags="novela.tags"
    :chapters="capitulos"
  />
</template>