<script setup>
// Importaciones
import { useRouter } from 'vue-router'
import { DoorClosed } from 'lucide-vue-next'
import { UsarSupabase } from '../services/UsarSupabase'

// Componentes
import Footer from '../components/Footer.vue';

// Variables
const router = useRouter()
const { logout } = UsarSupabase()

// Funciones
const logoutSession = async () => {

    await logout()
    router.push('/login')

}

</script>

<template>
    <div class="min-h-screen overflow-x-hidden flex flex-col">
        <div class="flex-1 w-full">
            <main class="flex min-h-150">
                <!--Menu lateral-->
                <aside class="fixed top-0 left-0 h-screen w-1/4 bg-slate-900 border border-slate-800">
                    <div class="flex flex-col items-center w-full pt-4 px-4">
                        <h1
                            class="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent text-4xl font-bold">
                            Nova Stella</h1>
                        <hr class="border-0 h-px bg-slate-700 mt-5 w-full" />
                        <div class="p-5">
                            <button class="text-white" aria-selected="true">Inicio</button>
                        </div>
                        <hr class="border-0 h-px bg-slate-700 mt-5 w-full" />
                        <button @click="logoutSession"
                            class="rounded w-35 h-10 text-red-700 font-bold hover:scale-105 transition duration-200 gap-2 flex items-center m-3">
                            <DoorClosed />
                            <span>Cerrar Sesión</span>
                        </button>

                    </div>
                </aside>

                <!--Contenido-->
                <section class="ml-[25%] w-3/4 bg-slate-950">
                    <div>
                        <h1 class="text-white font-bold text-4xl m-5">Dashboard</h1>
                        <hr class="border-0 h-px bg-slate-800 mt-5" />
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>