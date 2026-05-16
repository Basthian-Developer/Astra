<script setup>
// Importaciones
import { onMounted } from 'vue';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';

// Componentes
import Navbar from '../components/Navbar.vue'
import Separador from '../components/Separador.vue'

// Variables
const botones = [
    { tipo: 'link', referencia: 'inicio', url: '/', texto: 'Inicio' },
    { tipo: 'interno', referencia: 'informacion', texto: 'Información' },
    { tipo: 'interno', referencia: 'novelas', texto: 'Novelas' },
    { tipo: 'interno', referencia: 'autor', texto: 'Sobre mi' }
]

const acciones = [
    {url: '/login', texto: 'Acceder'}
]

// Aplicaciones
gsap.registerPlugin(ScrollTrigger)

// Funciones
onMounted(async () => {
    const inicio = document.getElementById('inicio')
    inicio.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })

    const tl = gsap.timeline()

    tl.from('.navbar', {
        y: -20,
        duration: 1,
        opacity: 0
    })

    tl.from('.inicio', {
        x: 100,
        duration: 0.7,
        opacity: 0
    })

    // SCROLL ANIMATIONS (INDEPENDIENTES)
    gsap.from('.separador', {
        y: -20,
        duration: 1,
        opacity: 0,
        scrollTrigger: {
            trigger: '.separador',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })

    gsap.from('.informacion', {
        x: -100,
        duration: 0.7,
        opacity: 0,
        scrollTrigger: {
            trigger: '.informacion',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })

    gsap.from('.novelas', {
        x: 100,
        duration: 0.7,
        opacity: 0,
        scrollTrigger: {
            trigger: '.novelas',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })

    gsap.from('.autor', {
        x: -100,
        duration: 0.7,
        opacity: 0,
        scrollTrigger: {
            trigger: '.autor',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })
})

</script>

<template>
    <div class="relative min-h-screen">
        <div class="fixed inset-0 -z-10">
            <img src="../assets/wallpapers/Fondo-pagina.webp" loading="lazy" alt="fondo"
                class="w-full h-full opacity-60 object-cover">
        </div>
        <div class="relative flex flex-col items-center">
            <!--Navbar-->
            <Navbar :botones="botones" :acciones="acciones" class="navbar"/>
            <!--Contenido principal-->
            <main class="flex-1 pt-24">
                <!--Inicio-->
                <div id="inicio" class="flex gap-40 items-center scroll-mt-24 inicio">
                    <!--Hero-->
                    <div class="flex flex-col items-center">
                        <h2
                            class="text-5xl font-bold max-w-md backdrop-blur bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center border-md">
                            Un mundo lleno de historias por contar
                        </h2>
                        <p
                            class="text-transparent bg-clip-text text-2xl font-mono max-w-md bg-gradient-to-r from-amber-700 to-amber-500 text-center font-bold font-serif">
                            Bienvenid@ a la biblioteca sagrada</p>
                        <div class="block mb-5"></div>
                        <button
                            class="bg-gradient-to-r from-blue-950 to-gray-700 rounded-full border border border-amber-500 text-amber-200 p-2 hover:scale-105 transition duration-200 font-bold">Explorar
                            biblioteca</button>
                    </div>
                    <!--Mascota-->
                    <img src="../assets/images/Hina-Saludando.webp" loading="lazy" alt="Hina-Portada"
                        class="w-80 object-contain hover:scale-105 transition duration-400">
                </div>

                <Separador class="separador" />

                <!--Informacion-->
                <div id="informacion" class="scroll-mt-24 informacion">
                    <p class="text-white text-center mb-200">¿De que trata?</p>
                </div>

                <Separador class="separador" />

                <!--Novelas recientes-->
                <div id="novelas" class="scroll-mt-24 novelas">
                    <p class="text-white text-center mb-200">Novelas recientes</p>
                </div>

                <Separador />

                <!--Sobre mi-->
                <div id="autor" class="scroll-mt-24 autor">
                    <p class="text-white text-center mb-200">¿Quien soy yo?</p>
                </div>
            </main>
            <footer class="text-slate-500 p-10 bg-slate-950/95 w-full text-center backdrop-blur uppercase">
                <p>@Derechos de autor reservados a StardustOwO</p>
            </footer>
        </div>
    </div>
</template>