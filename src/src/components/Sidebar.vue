<script setup>

// Importaciones
import { ref } from 'vue'
import { DoorClosed, Menu, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { UsarSupabase } from '../services/Auth'

// Variables
const router = useRouter()

const { logout } = UsarSupabase()

const sidebarOpen = ref(false)

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

    <!-- BOTON HAMBURGUESA -->
    <button
        @click="sidebarOpen = !sidebarOpen"
        class="lg:hidden fixed top-4 left-4 z-[60] bg-slate-900 p-2 rounded-xl border border-slate-700 text-white">
        <Menu v-if="!sidebarOpen" />

        <X v-else />

    </button>

    <!-- OVERLAY -->
    <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden">
    </div>

    <!-- SIDEBAR -->
    <aside
        v-if="secciones.length"
        :class="[
            'fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 z-50 transition-transform duration-300',

            'w-72 lg:w-1/4',

            sidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'
        ]">

        <div class="flex flex-col items-center h-full w-full pt-4 px-4">

            <h1 class="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent text-4xl font-bold">
                Nova Stella
            </h1>

            <hr class="border-0 h-px bg-slate-700 mt-5 w-full" />

            <div class="space-y-2 w-full flex-1 p-3">

                <div
                    v-for="(boton, index) in secciones"
                    :key="index"
                    class="w-full">

                    <RouterLink
                        :to="boton.ruta"
                        v-slot="{ isExactActive }">

                        <div
                            @click="sidebarOpen = false"
                            :class="[
                                'w-full py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-3',

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

            <button
                @click="logoutSession"
                class="rounded w-35 h-10 text-red-700 font-bold hover:scale-105 transition duration-200 gap-2 flex items-center m-3">

                <DoorClosed />

                <span>
                    Cerrar Sesión
                </span>

            </button>

        </div>

    </aside>

</template>