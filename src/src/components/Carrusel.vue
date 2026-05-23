<script setup>
import { computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'

const props = defineProps({
    novelas: Array,
    getPortada: Function
})

const usarSwiper = computed(() => {
    return props.novelas.length >= 3
})

onMounted(()=> {
    console.log(novelas)
})
</script>

<template>

    <!-- ========================= -->
    <!-- MOBILE: SIEMPRE SWIPER -->
    <!-- ========================= -->

    <div class="md:hidden">

        <Swiper :modules="[Autoplay]" :slides-per-view="1" :space-between="20" :autoplay="{
            delay: 4000,
            disableOnInteraction: false
        }" :loop="novelas.length > 1" :speed="1200">

            <SwiperSlide v-for="novela in novelas" :key="novela.id">

                <div class="flex justify-center">

                    <div
                        class="w-72 min-h-[440px] bg-slate-800 rounded-xl overflow-hidden shadow-lg text-white flex flex-col">

                        <img :src="getPortada(novela.imagen)" class="h-70 w-full object-cover" alt="Portada" />

                        <div class="p-4 flex flex-col flex-1">

                            <h3 class="text-xl font-serif font-bold">
                                {{ novela.titulo || 'Sin título' }}
                            </h3>

                            <p class="text-xs text-amber-600">
                                {{novela.year}}
                            </p>

                            <span class="inline-block w-fit text-xs px-2 py-1 rounded-full mt-2 mb-2 font-semibold"
                                :class="{
                                    'bg-gradient-to-r from-green-500 to-green-600 text-white': novela.desc_estado === 'emision',
                                    'bg-red-500 text-white': novela.desc_estado === 'cancelado',
                                    'bg-purple-700 text-white': novela.desc_estado === 'proximamente'
                                }">
                                {{ novela.estadoEmisionText }}
                            </span>

                            <button class="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest
                                bg-gradient-to-r from-amber-200 to-amber-500 text-slate-950
                                hover:from-amber-300 hover:to-amber-600
                                transition-all active:scale-95">
                                Leer novela
                            </button>

                        </div>
                    </div>
                </div>

            </SwiperSlide>
        </Swiper>
    </div>

    <!-- ========================= -->
    <!-- DESKTOP -->
    <!-- ========================= -->

    <div class="hidden md:block">

        <!-- FLEX SI HAY 1 o 2 -->

        <div v-if="!usarSwiper" class="flex justify-center gap-5">

            <div v-for="novela in novelas" :key="novela.id"
                class="w-72 min-h-[440px] bg-slate-800 rounded-xl overflow-hidden shadow-lg text-white flex flex-col">

                <img :src="getPortada(novela.imagen)" class="h-70 w-full object-cover" alt="Portada" />

                <div class="p-4 flex flex-col flex-1">

                    <h3 class="text-xl font-serif font-bold">
                        {{ novela.titulo || 'Sin título' }}
                    </h3>

                    <p class="text-xs text-amber-600">
                        {{ new Date(novela.created_at).getFullYear() }}
                    </p>

                    <span class="inline-block w-fit text-xs px-2 py-1 rounded-full mt-2 mb-2 font-semibold" :class="{
                        'bg-gradient-to-r from-green-500 to-green-600 text-white': novela.desc_estado === 'emision',
                        'bg-red-500 text-white': novela.desc_estado === 'cancelado',
                        'bg-purple-700 text-white': novela.desc_estado === 'proximamente'
                    }">
                        {{ novela.estadoEmisionText }}
                    </span>

                    <button class="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest
                        bg-gradient-to-r from-amber-200 to-amber-500 text-slate-950
                        hover:from-amber-300 hover:to-amber-600
                        transition-all active:scale-95">
                        Leer novela
                    </button>

                </div>
            </div>
        </div>

        <!-- SWIPER SI HAY 3+ -->

        <Swiper v-else :modules="[Autoplay]" :slides-per-view="3" :space-between="30" :autoplay="{
            delay: 4000,
            disableOnInteraction: false
        }" :loop="novelas.length > 3" :speed="1200">

            <SwiperSlide v-for="novela in novelas" :key="novela.id">

                <div class="flex justify-center">

                    <div
                        class="w-72 min-h-[440px] bg-slate-800 rounded-xl overflow-hidden shadow-lg text-white flex flex-col">

                        <img :src="getPortada(novela.imagen)" class="h-70 w-full object-cover" alt="Portada" />

                        <div class="p-4 flex flex-col flex-1">

                            <h3 class="text-xl font-serif font-bold">
                                {{ novela.titulo || 'Sin título' }}
                            </h3>

                            <p class="text-xs text-amber-600">
                                {{ new Date(novela.created_at).getFullYear() }}
                            </p>

                            <span class="inline-block w-fit text-xs px-2 py-1 rounded-full mt-2 mb-2 font-semibold"
                                :class="{
                                    'bg-gradient-to-r from-green-500 to-green-600 text-white': novela.desc_estado === 'emision',
                                    'bg-red-500 text-white': novela.desc_estado === 'cancelado',
                                    'bg-purple-700 text-white': novela.desc_estado === 'proximamente'
                                }">
                                {{ novela.estadoEmisionText }}
                            </span>

                            <button class="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest
                                bg-gradient-to-r from-amber-200 to-amber-500 text-slate-950
                                hover:from-amber-300 hover:to-amber-600
                                transition-all active:scale-95">
                                Leer novela
                            </button>

                        </div>
                    </div>
                </div>

            </SwiperSlide>
        </Swiper>

    </div>

</template>