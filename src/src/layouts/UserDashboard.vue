<script setup>
// Importaciones
import { ref } from 'vue';

// Componentes
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

// Variables
const secciones = ref([
    { texto: 'Inicio', ruta: '/dashboard/user/inicio' },
    { texto: 'Novelas', ruta: '/dashboard/user/novelas' }
])

</script>

<template>
    <div class="min-h-screen overflow-x-hidden flex flex-col">
        <div class="flex-1 w-full">
            <main class="flex min-h-150">
                <!--Menu lateral-->
                <Sidebar :secciones="secciones"/>

                <!--Contenido-->
                <section class="ml-[25%] w-3/4 bg-slate-950">
                    <RouterView/>
                </section>
            </main>
        </div>
    </div>
</template>