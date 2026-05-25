<script setup>
// Importaciones
import { computed, onMounted, onUnmounted, defineAsyncComponent, nextTick } from 'vue';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';
import { NovelasPublicas } from '../services/Novelas-Publicas';

// Componentes
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue';
import Separador from '../components/Separador.vue'

// Variables
const botones = [
    { tipo: 'link', referencia: 'inicio', url: '/', texto: 'Inicio' },
    { tipo: 'interno', referencia: 'informacion', texto: 'Información' },
    { tipo: 'interno', referencia: 'novelas', texto: 'Novelas' },
    { tipo: 'interno', referencia: 'autor', texto: 'Sobre mi' }
]

const NovelasCarrusel = defineAsyncComponent(() =>
    import('../components/Carrusel.vue')
)

const novelasStore = NovelasPublicas()

const novelasDestacadas = computed(() => {
    return novelasStore.novelasPublicas ?? []
})

let ctx = null

gsap.registerPlugin(ScrollTrigger)

onMounted(async () => {

    // 1. cargar data
    await novelasStore.getNovelas()

    // 2. esperar render real de Vue (CLAVE para evitar parpadeo)
    await nextTick()

    // 3. preparar estado inicial (evita flash de contenido)
    gsap.set([
        '.navbar',
        '.inicio',
        '.separador',
        '.informacion',
        '.novelas',
        '.autor'
    ], {
        opacity: 0
    })

    // 4. animaciones dentro de contexto GSAP
    ctx = gsap.context(() => {

        const tl = gsap.timeline()

        tl.to('.navbar', {
            y: 0,
            opacity: 1,
            duration: 0.8
        })

        tl.to('.inicio', {
            x: 0,
            opacity: 1,
            duration: 0.7
        }, "-=0.3")

        // Scroll animations (sin reflow raro)
        gsap.utils.toArray([
            '.separador',
            '.informacion',
            '.novelas',
            '.autor'
        ]).forEach((el) => {

            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true
                    }
                }
            )

        })

        ScrollTrigger.refresh()

    })

})

onUnmounted(() => {
    ctx?.revert()
    ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
    <div class="relative min-h-screen overflow-x-hidden">
        <div class="fixed inset-0 -z-10">
            <div class="fondo"></div>
        </div>
        <div class="relative flex flex-col items-center">
            <!--Navbar-->
            <Navbar :botones="botones" :login="true" class="navbar" />
            <!--Contenido principal-->
            <main class="flex-1 pt-24 w-full">
                <!--Inicio-->
                <div id="inicio"
                    class="flex flex-col md:flex-row gap-5 md:gap-30 justify-center items-center scroll-mt-24 inicio w-full">
                    <!--Hero-->
                    <div class="flex flex-col items-center">
                        <div class="flex-1 text-center">
                            <div class="flex flex-col items-center mt-30 mb-15">
                                <h2
                                    class="text-5xl font-bold max-w-md backdrop-blur bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center border-md">
                                    Un mundo lleno de historias por contar
                                </h2>
                                <p
                                    class="text-transparent bg-clip-text text-2xl font-mono max-w-md bg-gradient-to-r from-amber-700 to-amber-500 text-center font-bold font-serif">
                                    Bienvenid@ a la biblioteca sagrada</p>
                                <div class="block mb-5"></div>
                                <button
                                    class="bg-gradient-to-r from-blue-950 to-gray-800 rounded-full border border border-amber-500 text-amber-200 p-2 hover:scale-105 transition duration-200 font-bold">Explorar
                                    biblioteca</button>

                            </div>
                        </div>
                        <p class="text-center text-slate-400 animate-bounce">Sigue deslizando <br> V</p>
                    </div>

                    <!--Mascota-->
                    <img src="../assets/images/Hana-Saludando.webp" loading="lazy" alt="Hina-Portada"
                        class="w-100 md:w-80 object-contain hover:scale-105 transition duration-400">

                </div>

                <Separador class="separador" />

                <!--Informacion-->
                <div id="informacion" class="scroll-mt-24 informacion">
                    <p
                        class="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent text-center my-15 font-bold text-4xl">
                        ¿Qué es este lugar?</p>
                    <div class="flex flex-col md:flex-row justify-center items-center gap-15">
                        <div class="hidden md:flex">
                            <img src="../assets/images/Hana-Maid.webp" loading="lazy" alt="Hina-Portada"
                                class="w-100 md:w-80 object-contain hover:scale-105 transition duration-400">
                        </div>

                        <div>
                            <p
                                class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-2xl leading-relaxed tracking-wide">
                                Nova Stella es un proyecto donde comparto historias creadas a partir de personajes
                                utilizados en
                                videojuegos
                                y
                                experiencias de roleplay.
                            </p>
                            <p
                                class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-2xl leading-relaxed tracking-wide">
                                Cada obra puede reutilizar personajes, pero cada una se desarrolla en un universo
                                independiente, donde los
                                eventos y relaciones no se conectan entre sí, a no ser de que se indique textualmente en
                                la obra.
                            </p>
                            <p
                                class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-2xl leading-relaxed tracking-wide">
                                El sitio está en constante desarrollo, por lo que puede recibir cambios visuales o
                                funcionales con el
                                tiempo,
                                siempre buscando mejorar la experiencia de lectura.
                            </p>
                            <p
                                class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-2xl leading-relaxed tracking-wide">
                                Actualmente el proyecto se encuentra en una fase inicial y utiliza herramientas
                                gratuitas, pero en el
                                futuro
                                podría expandirse si continúa creciendo.
                            </p>

                            <p class="text-center text-slate-400 animate-bounce mt-10">Sigue deslizando <br> V</p>
                        </div>

                        <div class="md:hidden">
                            <img src="../assets/images/Hana-Maid.webp" loading="lazy" alt="Hina-Portada"
                                class="w-100 object-contain hover:scale-105 transition duration-400">
                        </div>
                    </div>
                </div>

                <Separador class="separador" />

                <!--Novelas recientes-->
                <div id="novelas" class="w-full scroll-mt-24 novelas">
                    <p
                        class="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent text-center my-10 font-bold text-4xl">
                        Novelas recientes</p>
                    <div class="overflow-hidden w-full">
                        <div class="max-w-6xl mx-auto">
                            <NovelasCarrusel :novelas="novelasDestacadas" :getPortada="novelasStore.getPortada" />
                        </div>
                        <p class="text-center text-slate-400 animate-bounce mt-10">Sigue deslizando <br> V</p>
                    </div>
                </div>

                <Separador />

                <!--Sobre mi-->
                <div id="autor" class="scroll-mt-24 autor my-30">
                    <p
                        class="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent text-center my-15 font-bold text-4xl">
                        Sobre mi</p>

                    <div class="flex flex-col md:flex-row justify-center items-center gap-15">
                        <div class="flex flex-col">
                            <p class="mt-6 text-slate-400 mx-15 text-left text-base md:mx-auto max-w-md md:max-w-3xl">
                                Me llamo Basthian aunque actualmente me hago llamar StardustOwO en el mundo de internet.
                                Realizo diversas
                                actividades, pero la
                                principal es jugar videojuegos en los que encarno personajes ficticios. A través del
                                gaming
                                y el rol han
                                nacido varios
                                personajes únicos y historias impresionantes por contar.
                            </p>
                            <p class="mt-6 text-slate-400 mx-15 text-left text-base md:mx-auto max-w-md md:max-w-3xl">
                                Mi motivación principal en este proyecto web es el de tener la posibilidad de compartir
                                novelas escritas
                                por mi, y tambien, el mostrar la calidad de mi trabajo como desarrollador pese a las
                                limitaciones que
                                tenga en cuanto a herramientas.
                            </p>
                            <p class="mt-6 text-slate-400 mx-15 text-left text-base md:mx-auto max-w-md md:max-w-3xl">
                                Espero que les guste mucho, y cualquier cosa pueden contactarme por el medio que estimen
                                conveniente.
                            </p>
                        </div>

                        <div class="w-64 h-64 rounded-full overflow-hidden">
                            <img src="../assets/images/autor.webp" alt="autor" loading="lazy"
                                class="w-full h-full object-cover" />
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    </div>
</template>

<style scoped>
/* Evita parpadeo inicial antes de GSAP */
.navbar,
.inicio,
.separador,
.informacion,
.novelas,
.autor {
    opacity: 0;
    transform: translateY(0px);
}

/* mejora render GPU */
.inicio,
.informacion,
.novelas,
.autor {
    will-change: transform, opacity;
}

/* evita repaint raro en scroll */
body {
    overflow-x: hidden;
}
</style>