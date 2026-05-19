<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuAbierto = ref(false)

// Variables
const props = defineProps({
    botones: {
        type: Array,
        default: () => []
    },
    login: {
        type: Boolean,
        default: () => false
    }
})

defineOptions({
    inheritAttrs: false
})

// Funciones
const redirigir = (tipo, referencia, url) => {
    if (!tipo) return

    if (tipo === 'interno') {
        if (!referencia) return

        const elemento = document.getElementById(referencia)

        if (!elemento) return

        elemento.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
    else if (tipo === "link") {
        if (!url) return

        if (url === '/') {
            if (referencia) {
                const elemento = document.getElementById(referencia)

                if (elemento) {
                    elemento.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    })
                }

                return
            }

            router.push(url)
        }

        router.push(url)
    }
}

const goLogin = () => {
    router.push('/login')
}

const toggleMenu = () => {
    menuAbierto.value = !menuAbierto.value
}

const cerrarMenu = () => {
    menuAbierto.value = false
}
</script>

<template>
    <nav v-bind="$attrs"
        class="fixed top-0 left-0 z-50 bg-slate-950/30 w-full h-20 flex justify-between items-center shadow-2xl backdrop-blur-sm">
        <!--Titular-->
        <h1
            class="text-5xl font-bold bg-gradient-to-r from-yellow-500 to-white bg-clip-text text-transparent mx-5 font-sans italic">
            Nova Stella</h1>

        <!--Panel de botones-->
        <div class="flex items-center mx-5 text-white md:flex md:gap-7 select-none">
            <div class="hidden md:flex md:gap-7">
                <div v-for="(boton, index) in botones" :key="index">
                    <button class="hover:scale-105 hover:text-slate-200 transition duration-200 text-xl text-slate-400"
                        @click="redirigir(boton.tipo, boton.referencia, boton.url)">{{ boton.texto }}</button>
                </div>
            </div>

            <div v-if="login === true">
                <button
                    class="hover:scale-105 hover:text-slate-200 transition duration-200 text-xl text-slate-200 rounded shadow-2xl font-bold p-2 bg-gradient-to-r from-blue-950 to-cyan-700"
                    @click="goLogin">Acceder</button>
            </div>
            <button class="md:hidden text-white text-3xl mx-5" @click="toggleMenu">
                ☰
            </button>
        </div>
    </nav>
    <!-- MENU MOBILE -->
    <div v-if="menuAbierto"
        class="absolute top-20 left-0 z-50 w-full bg-slate-950/95 backdrop-blur-md flex flex-col items-center gap-6 py-6 md:hidden text-white">
        <div v-for="(boton, index) in botones" :key="index">
            <button class="text-xl text-slate-300 hover:text-white"
                @click="() => { redirigir(boton.tipo, boton.referencia, boton.url); cerrarMenu() }">
                {{ boton.texto }}
            </button>
        </div>
    </div>
</template>