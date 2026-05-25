<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { NovelasPublicas } from '../services/Novelas-Publicas'

import Navbar from './Navbar.vue'

const route = useRoute()
const novelasService = NovelasPublicas()

const novela = ref(null)

const botones = [
    { tipo: 'link', url: '/', texto: 'Inicio' }
]

onMounted(async () => {

    novela.value = await novelasService
        .getNovelaBySlug(route.params.slug)
})
</script>

<template>

    <!-- LOADING -->
    <div v-if="!novela" class="min-h-screen
    flex items-center justify-center
    bg-[#0d0817]">

        <div class="flex flex-col items-center gap-4">

            <div class="w-14 h-14
            rounded-full
            border-4 border-fuchsia-500/20
            border-t-fuchsia-500
            animate-spin"></div>

            <p class="text-purple-200
            text-base font-medium">
                Cargando novela...
            </p>

        </div>

    </div>

    <!-- CONTENIDO -->
    <div v-else class="relative min-h-screen
    overflow-hidden
    bg-[#0d0817]">

        <!-- FONDOS -->
        <div class="absolute inset-0 -z-10">

            <!-- gradiente -->
            <div class="absolute inset-0
            bg-gradient-to-b
            from-[#140d20]
            via-[#1a1128]
            to-[#09050f]"></div>

            <!-- glow -->
            <div class="absolute top-[-180px] left-[-120px]
            w-[420px] h-[420px]
            rounded-full
            bg-fuchsia-600/15
            blur-3xl"></div>

            <div class="absolute bottom-[-180px] right-[-120px]
            w-[420px] h-[420px]
            rounded-full
            bg-violet-700/15
            blur-3xl"></div>

        </div>

        <Navbar :botones="botones" />

        <!-- CONTENEDOR -->
        <div class="max-w-6xl mx-auto
        px-4 md:px-8
        py-8 md:py-12 mt-25">

            <!-- HERO -->
            <section class="relative
            rounded-[28px]
            overflow-hidden
            border border-white/10
            bg-white/[0.04]
            backdrop-blur-xl
            shadow-[0_0_50px_rgba(0,0,0,0.35)]">

                <!-- decoracion -->
                <div class="absolute top-0 right-0
                w-[280px] h-[280px]
                bg-fuchsia-500/10
                blur-3xl
                rounded-full"></div>

                <!-- contenido -->
                <div class="relative
                grid grid-cols-1 lg:grid-cols-[240px_1fr]
                gap-8
                p-5 md:p-8">

                    <!-- COLUMNA IZQUIERDA -->
                    <div class="flex flex-col items-center lg:items-start">

                        <!-- portada -->
                        <div class="relative group">

                            <!-- glow -->
                            <div class="absolute inset-0
                            rounded-[24px]
                            bg-fuchsia-500/20
                            blur-xl
                            scale-95"></div>

                            <div class="relative
                                overflow-hidden
                                rounded-[24px]
                                border border-white/10
                                shadow-2xl  
                                w-[220px] md:w-[250px]
                                shrink-0">

                                <img :src="novelasService.getPortada(novela.imagen)" :alt="novela.titulo" class="w-full
                                    h-100
                                    object-cover
                                    transition duration-500
                                    group-hover:scale-105">

                            </div>

                        </div>

                        <!-- tags -->
                        <div v-if="novela.tags" class="flex flex-wrap
                            justify-center lg:justify-center
                            gap-2 mt-5
                            w-[220px] md:w-[250px] mx-auto lg:mx-0">

                            <span v-for="tag in novela.tags" :key="tag" class="px-3 py-1
                                rounded-full
                                text-[11px] font-medium
                                bg-white/5
                                border border-white/10
                                text-purple-100">
                                #{{ tag }}
                            </span>

                        </div>

                    </div>

                    <!-- COLUMNA DERECHA -->
                    <div class="flex flex-col justify-center">

                        <!-- titulo -->
                        <h1 class="text-3xl md:text-5xl
                        font-black
                        text-white
                        leading-tight
                        max-w-4xl">
                            {{ novela.titulo }}
                        </h1>

                        <!-- linea -->
                        <div class="w-28 h-1
                        rounded-full
                        bg-gradient-to-r
                        from-fuchsia-500
                        via-purple-500
                        to-violet-500
                        mt-5 mb-5"></div>

                        <!-- sinopsis -->
                        <div class="rounded-2xl
                        border border-white/10
                        bg-black/15
                        p-4 md:p-5
                        max-w-4xl">

                            <p class="text-slate-300
                            text-sm md:text-[15px]
                            leading-7
                            whitespace-pre-line
                            line-clamp-6">
                                {{ novela.sinopsis.replace(/\\n/g, '\n') }}
                            </p>

                        </div>

                        <!-- stats -->
                        <div class="grid grid-cols-1 md:grid-cols-3
                        gap-3 mt-7">

                            <!-- autor -->
                            <div class="rounded-2xl
                            border border-white/10
                            bg-white/5
                            p-4">

                                <p class="text-[10px] uppercase
                                tracking-[0.2em]
                                text-slate-500">
                                    Autor
                                </p>

                                <p class="text-white
                                text-sm md:text-base
                                font-semibold
                                mt-2">
                                    {{ novela.autor }}
                                </p>

                            </div>

                            <!-- publicacion -->
                            <div class="rounded-2xl
                            border border-white/10
                            bg-white/5
                            p-4">

                                <p class="text-[10px] uppercase
                                tracking-[0.2em]
                                text-slate-500">
                                    Publicación
                                </p>

                                <p class="text-white
                                text-sm md:text-base
                                font-semibold
                                mt-2">
                                    {{ novela.year }}
                                </p>

                            </div>

                            <!-- estado -->
                            <div class="rounded-2xl
                            border border-white/10
                            bg-white/5
                            p-4">

                                <p class="text-[10px] uppercase
                                tracking-[0.2em]
                                text-slate-500">
                                    Estado
                                </p>

                                <p class="text-white
                                text-sm md:text-base
                                font-semibold
                                mt-2">
                                    {{ novela.estadoEmisionText }}
                                </p>

                            </div>

                        </div>

                        <!-- acciones -->
                        <div class="flex flex-wrap gap-3 mt-8">

                            <!-- boton principal -->
                            <button class="group
                            relative overflow-hidden
                            px-5 py-2.5
                            rounded-xl
                            font-semibold
                            text-sm
                            text-white
                            bg-gradient-to-r
                            from-fuchsia-500
                            via-purple-500
                            to-violet-600
                            hover:opacity-90
                            transition duration-300
                            shadow-lg shadow-purple-950/30">

                                <span class="relative z-10">
                                    Leer novela
                                </span>

                            </button>

                            <!-- secundario -->
                            <button class="px-5 py-2.5
                            rounded-xl
                            border border-white/10
                            bg-white/5
                            text-sm
                            text-slate-200
                            hover:bg-white/10
                            hover:border-white/20
                            transition duration-300">
                                Guardar
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            <!-- CAPITULOS -->
            <section class="mt-8
            rounded-[28px]
            border border-white/10
            bg-white/[0.04]
            backdrop-blur-xl
            overflow-hidden">

                <!-- header -->
                <div class="flex flex-col lg:flex-row
                lg:items-center lg:justify-between
                gap-5
                p-6
                border-b border-white/10">

                    <div>

                        <p class="text-fuchsia-300
                        uppercase
                        tracking-[0.25em]
                        text-[10px]
                        font-bold">
                            Biblioteca
                        </p>

                        <h2 class="text-white
                        text-2xl md:text-3xl
                        font-black
                        mt-2">
                            Capítulos
                        </h2>

                        <p class="text-slate-400
                        text-sm
                        mt-2 max-w-xl">
                            Explora todos los capítulos disponibles
                            de esta historia.
                        </p>

                    </div>

                    <!-- filtros -->
                    <div class="flex flex-wrap gap-2">

                        <button class="px-4 py-2
                        rounded-lg
                        bg-white/5
                        border border-white/10
                        text-sm
                        text-slate-200
                        hover:bg-white/10
                        transition">
                            Ascendente
                        </button>

                        <button class="px-4 py-2
                        rounded-lg
                        bg-white/5
                        border border-white/10
                        text-sm
                        text-slate-200
                        hover:bg-white/10
                        transition">
                            Descendente
                        </button>

                    </div>

                </div>

                <!-- contenido -->
                <div class="p-6">

                    <!-- placeholder -->
                    <div class="rounded-2xl
                    border border-dashed border-white/10
                    bg-black/10
                    py-16 px-5
                    text-center">

                        <div class="w-16 h-16
                        rounded-full
                        bg-white/5
                        border border-white/10
                        flex items-center justify-center
                        mx-auto mb-5">

                            <span class="text-2xl">
                                📚
                            </span>

                        </div>

                        <h3 class="text-white
                        text-xl font-bold">
                            No hay capítulos disponibles
                        </h3>

                        <p class="text-slate-400
                        text-sm
                        mt-3 max-w-lg mx-auto">
                            Esta novela todavía no posee capítulos
                            publicados o se encuentran en preparación.
                        </p>

                    </div>

                </div>

            </section>

        </div>

    </div>

</template>