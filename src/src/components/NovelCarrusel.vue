<script setup>
import { onMounted, computed } from 'vue';
import useEmblaCarousel from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import { usarNovelas } from '../composables/usarNovelas';
import { usarNavegacion } from '../composables/usarNavegacion';

const { novelas, cargarNovelas } = usarNovelas()
const navegarA = usarNavegacion()

const [emblaRef, emblaApi] = useEmblaCarousel(
    {
        loop: true,
        align: 'start'
    },
    [
        Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true
        })
    ]
)

const props = defineProps({
    destacado: {
        type: Boolean,
        default: false
    },
    catalogo: {
        type: Boolean,
        default: false
    }
})

const novelasFiltradas = computed(() =>
    props.destacado
        ? novelas.value.filter(n => n.destacado)
        : novelas.value
)

onMounted(() => {
    cargarNovelas()
})
</script>

<template>
    <div class="overflow-hidden md:px-2" ref="emblaRef">
        <div class="flex">

            <div v-for="novela in novelasFiltradas" :key="novela.id"
                class="shrink-0 grow-0 basis-full md:basis-1/3 px-3">
                <div
                    class="book-card group bg-slate-900/50 p-5 rounded-2xl border border-slate-800 hover:border-amber-200/50 transition-colors cursor-pointer">

                    <div
                        class="aspect-square bg-gradient-to-tr from-slate-800 to-slate-700 rounded-lg mb-6 shadow-2xl overflow-hidden">
                        <img v-if="novela.imagen" :src="novela.imagen" class="w-full h-full object-cover" />
                    </div>

                    <span class="text-amber-200/60 text-xs uppercase italic">
                        {{ novela.year }}
                    </span>

                    <h3 class="text-2xl mt-2 mb-3">
                        {{ novela.titulo }}
                    </h3>

                    <p class="text-slate-400 text-sm mb-3">
                        {{ novela.desc }}
                    </p>

                    <button @click="navegarA(novela.info.ruta)" class="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest
  bg-gradient-to-r from-amber-200 to-amber-500 text-slate-950
  hover:from-amber-300 hover:to-amber-600
  transition-all active:scale-95 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
                        Leer novela
                    </button>

                </div>
            </div>

        </div>
    </div>
</template>