<script setup>

// Importaciones
import { DoorClosed } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { UsarSupabase } from '../services/UsarSupabase'

// Variables
const router = useRouter()
const { logout } = UsarSupabase()

const props = defineProps({
    secciones: {
        type: Array,
        default: () => []
    }
})

// Funciones
const logoutSession = async () => {

    await logout()
    router.push('/login')

}
</script>

<template>
    <!--Menu lateral-->
    <aside v-if="secciones.length" class="fixed top-0 left-0 h-screen w-1/4 bg-slate-900 border border-slate-800">
        <div class="flex flex-col items-center h-full w-full pt-4 px-4">
            <h1 class="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent text-4xl font-bold">
                Nova Stella</h1>
            <hr class="border-0 h-px bg-slate-700 mt-5 w-full" />
            <div class="space-y-2 w-full flex-1 p-3">
                <div v-for="(boton, index) in secciones" :key="index" class="w-full">
                    <RouterLink :to="boton.ruta" v-slot="{ isExactActive }">
                        <div :class="[
                            'w-full w-full py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-3',

                            isExactActive
                                ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/40'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        ]">
                            {{ boton.texto }}
                        </div>
                    </RouterLink>
                </div>
            </div>
            <hr class="border-0 h-px bg-slate-700 mt-5 w-full" />
            <button @click="logoutSession"
                class="rounded w-35 h-10 text-red-700 font-bold hover:scale-105 transition duration-200 gap-2 flex items-center m-3">
                <DoorClosed />
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </aside>
</template>