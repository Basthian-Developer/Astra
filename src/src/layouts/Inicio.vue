<script setup>
// Importación general
import { onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import useEmblaCarousel from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'

// Importación de componentes
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import NovelCarrusel from '../components/NovelCarrusel.vue'

// Importación de composables
import { usarNovelas } from '../composables/usarNovelas.js'
import { usarNavegacion } from '../composables/usarNavegacion.js'

// Variables
const { novelas, cargarNovelas } = usarNovelas()
const navegarA = usarNavegacion()
const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,
    align: 'start'
  },
  [
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true
    })
  ]
)

const navItems = [
  { label: 'inicio', to: '/inicio' },
  { label: 'informacion', to: '#informacion' },
  { label: 'obras recientes', to: '#novelas' },
  { label: 'biografia', to: '#biografia' }
]

// Funciones

onMounted(async () => {
  cargarNovelas()

  await nextTick()

  let tl = gsap.timeline()

  tl.from('nav', {
    y: -20,
    duration: 0.3,
    opacity: 0
  })
    .from('.hero', {
      x: 50,
      duration: 1,
      opacity: 0
    })
    .from('.informacion', {
      x: -50,
      duration: 1,
      opacity: 0
    })
    .from('.obras', {
      x: 50,
      duration: 1,
      opacity: 0
    })
    .from('.biografia', {
      x: -50,
      duration: 1,
      opacity: 0
    })
})


</script>

<template>
  <!--PAGINA GENERAL-->
  <div class="min-h-dvh flex flex-col bg-slate-950 text-slate-200 overflow-x-hidden">
    <!--Navegación-->
    <div class="nav">
      <Navbar :nav-items="navItems" />
    </div>

    <!--Contenido-->
    <main class="flex-1 pt-30 md:pt-15">
      <!--Portada-->
      <section class="flex flex-col items-center min-h-screen justify-center hero">
        <div class="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-10 md:gap-30 w-full">

          <!-- Texto -->
          <div class="w-full md:w-1/2 flex flex-col items-center md:items-center text-center space-y-6">

            <h1 class="text-5xl md:text-6xl font-bold text-amber-200">
              Nova Stella
            </h1>

            <p class="text-slate-300 text-lg max-w-md">
              Todo personaje tiene su historia.
            </p>

            <p class="text-slate-500 max-w-md text-sm">
              Pulsa aquí para explorar el catálogo de novelas disponibles
            </p>

            <RouterLink to="/novelas"
              class="px-8 py-4 border border-amber-200/30 text-amber-200 hover:bg-amber-200 hover:text-slate-950 transition-all duration-500 rounded-full uppercase tracking-widest text-xs font-bold">
              Explorar catálogo
            </RouterLink>

            <div class="mt-6 flex flex-col items-center text-slate-500 animate-bounce">
              <span class="text-xs uppercase tracking-widest">Desliza hacia abajo</span>
              <svg class="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Imagen -->
          <div class="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center">
            <img src="/ilustraciones/Hina-Saludando.jpg" class="w-auto max-h-[45vh] md:max-h-[85vh] object-contain"
              alt="pet-portada" />
            <p class="text-slate-500">Hana - Guardiana de la biblioteca</p>
          </div>

          <!-- Imagen -->
          <div class="md:hidden flex w-full md:w-1/2 flex-col justify-center items-center">
            <img src="/ilustraciones/Hana-Dragon-Roar.jpg" class="w-auto max-h-[85vh] object-contain"
              alt="pet-portada" />
            <p class="text-slate-500">Hana - Guardiana de la biblioteca</p>
          </div>

        </div>
      </section>

      <div class="border-t border-slate-900 my-12"></div>

      <!--Descripcion-->
      <section id="informacion" class="flex flex-col items-center mb-16 scroll-mt-30 informacion">
        <div class="flex flex-col md:flex-row justify-center">
          <div class="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center">
            <img src="/ilustraciones/Hana-Sensei.jpg" alt="Hana presentado"
              class="w-auto max-h-[45vh] md:max-h-[85vh] object-contain">
          </div>
          <div class="flex flex-col items-center">
            <h1 class="text-3xl md:text-4xl font-bold text-amber-200">¿Qué es este lugar?</h1>
            <p
              class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-3xl leading-relaxed tracking-wide">
              Nova Stella es un proyecto donde comparto historias creadas a partir de personajes utilizados en
              videojuegos
              y
              experiencias de roleplay.
            </p>
            <p
              class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-3xl leading-relaxed tracking-wide">
              Cada obra puede reutilizar personajes, pero cada una se desarrolla en un universo independiente, donde los
              eventos y relaciones no se conectan entre sí, a no ser de que se indique textualmente en la obra.
            </p>
            <p
              class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-3xl leading-relaxed tracking-wide">
              El sitio está en constante desarrollo, por lo que puede recibir cambios visuales o funcionales con el
              tiempo,
              siempre buscando mejorar la experiencia de lectura.
            </p>
            <p
              class="mt-6 text-slate-400 text-base mx-12 text-left md:mx-auto max-w-md md:max-w-3xl leading-relaxed tracking-wide">
              Actualmente el proyecto se encuentra en una fase inicial y utiliza herramientas gratuitas, pero en el
              futuro
              podría expandirse si continúa creciendo.
            </p>
          </div>
          <div class="flex md:hidden w-full md:w-1/2 flex-col justify-center items-center">
            <img src="/ilustraciones/Hana-Maid.jpg" alt="Hana presentado"
              class="w-auto max-h-[85vh] object-contain">
          </div>
        </div>

        <div class="mt-6 flex flex-col items-center text-slate-500 animate-bounce">
          <span class="text-xs uppercase tracking-widest">Desliza hacia abajo</span>
          <svg class="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <div class="border-t border-slate-900"></div>

      <!--Obras recientes-->
      <section id="novelas" class="py-6 md:py-10 px-6 max-w-7xl mx-auto obras">
        <h2 class="text-4xl serif my-16 text-center text-amber-200 font-bold">Obras Recientes</h2>

        <p class="md:hidden text-slate-500 text-center my-2">Desliza horizontalmente para ver más obras</p>
        <NovelCarrusel :destacado="true" />
        <div class="mt-6 flex flex-col items-center text-slate-500 animate-bounce">
          <span class="text-xs uppercase tracking-widest">Desliza hacia abajo</span>
          <svg class="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <div class="border-t border-slate-900 my-12"></div>

      <!--Biografia-->
      <section id="biografia" class="mb-15 flex flex-col items-center mb-16 scroll-mt-30 biografia"">
        <h1 class=" text-amber-200 font-bold serif text-3xl md:text-4xl mb-10 md:my-5">Acerca de mi</h1>
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-15">
          <div class="w-64 h-64 rounded-full overflow-hidden">
            <img src="/ilustraciones/dibujo-anime-autor.png" alt="autor" class="w-full h-full object-cover" />
          </div>

          <div class="flex flex-col">
            <p class="mt-6 text-slate-400 mx-15 text-left text-base md:mx-auto max-w-md md:max-w-3xl">
              Me llamo Basthian aunque actualmente me hago llamar StardustOwO en el mundo de internet. Realizo diversas
              actividades, pero la
              principal es jugar videojuegos en los que encarno personajes ficticios. A través del gaming y el rol han
              nacido varios
              personajes únicos y historias impresionantes por contar.
            </p>
            <p class="mt-6 text-slate-400 mx-15 text-left text-base md:mx-auto max-w-md md:max-w-3xl">
              Mi motivación principal en este proyecto web es el de tener la posibilidad de compartir novelas escritas
              por mi, y tambien, el mostrar la calidad de mi trabajo como desarrollador pese a las limitaciones que
              tenga en cuanto a herramientas.
            </p>
            <p class="mt-6 text-slate-400 mx-15 text-left text-base md:mx-auto max-w-md md:max-w-3xl">
              Espero que les guste mucho, y cualquier cosa pueden contactarme por el medio que estimen conveniente.
            </p>
          </div>

        </div>

      </section>
    </main>

    <!--Footer-->
    <Footer />
  </div>
</template>

<style scoped></style>