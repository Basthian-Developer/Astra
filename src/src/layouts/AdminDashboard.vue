<script setup>
// Importaciones
import { ref } from 'vue'

// Componentes
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

// Variables
const secciones = ref([
    { texto: 'Inicio', ruta: '/dashboard/admin/inicio' },
    { texto: 'Novelas', ruta: '/dashboard/admin/novelas' },
    { texto: 'Usuarios', ruta: '/dashboard/admin/usuarios'}
])

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="flex-1 w-full">
            <main class="flex min-h-150">
                <!--Menu lateral-->
                <Sidebar :secciones="secciones" />

                <!--Contenido-->
                <section class="md:ml-[25%] md:w-3/4 bg-slate-950 overflow-x-auto w-full">
                    <RouterView />
                </section>
            </main>
        </div>
    </div>
</template>