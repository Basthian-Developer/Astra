<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

// Variables
const props = defineProps({
    botones: {
        type: Array,
        default: () => []
    },
    acciones: {
        type: Array,
        default: () => []
    }
})

// Funciones
const redirigir = (tipo, referencia, url) => {
    if (!tipo) return

    if(tipo === 'interno'){
        if(!referencia) return

        const elemento = document.getElementById(referencia)

        if(!elemento) return

        elemento.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }else if (tipo === "link"){
        if(!url) return

        if(url === '/'){
            const elemento = document.getElementById(referencia)

            if(!elemento) return

            elemento.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
        router.push(url)
    }
}

</script>

<template>
    <nav
        class="fixed top-0 left-0 z-50 bg-slate-950/30 w-full h-20 flex justify-between items-center shadow-2xl backdrop-blur-sm">
        <!--Titular-->
        <h1
            class="text-5xl font-bold bg-gradient-to-r from-yellow-500 to-white bg-clip-text text-transparent mx-5 font-sans italic">
            Nova Stella</h1>

        <!--Panel de botones-->
        <div class="flex items-center mx-5 text-white md:flex md:gap-7 select-none">
            <div v-for="(boton, index) in botones" :key="index">
                <button
                    class="hover:scale-105 hover:text-slate-200 transition duration-200 text-xl text-slate-400" @click="redirigir(boton.tipo, boton.referencia, boton.url)">{{ boton.texto }}</button>
            </div>
            <div v-for="(boton, index) in acciones" :key="index">
                <button class="hover:scale-105 hover:text-slate-200 transition duration-200 text-xl text-slate-200 rounded shadow-2xl font-bold p-2 bg-gradient-to-r from-blue-950 to-cyan-700">{{boton.texto}}</button>
            </div>
        </div>
    </nav>
</template>