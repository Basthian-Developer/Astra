<script setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  nextTick
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

/* ==================================================
   COMPONENTES
================================================== */

import BackLink from './BackLink.vue'
import Navbar from './Navbar.vue'

/* ==================================================
   COMPOSABLES
================================================== */

/*
visor PDF:
maneja carga del documento y renderizado
de páginas en canvas
*/
import { usarPdfCapitulo } from '../composables/usarPdfCapitulo'

/*
datos generales de novelas
*/
import { usarNovelas } from '../composables/usarNovelas'

/*
capítulos de cada novela
*/
import { usarCapitulos } from '../composables/usarCapitulos'

/* ==================================================
   ROUTER
================================================== */

/*
route:
leer parámetros actuales de la URL
*/
const route = useRoute()

/*
router:
navegar entre rutas
*/
const router = useRouter()

const loadingPdf = ref(true)

const isChapterValid = (chapter) => {
  return chapter && chapter.slug && chapter.slug !== '#'
}

const nextChapter = computed(() => {
  if (currentIndex.value === -1) return null
  return chapters.value[currentIndex.value + 1] || null
})

const nextChapterValid = computed(() => {
  return isChapterValid(nextChapter.value)
})

const canLoadChapter = computed(() => {
  const chapter = capitulos.value.find(c =>
    normalize(c.slug) === normalize(slug.value)
  )

  return isChapterValid(chapter)
})

/*
slug actual del capítulo desde la URL
Ejemplo:
 /capitulo/capitulo-5
*/
const slug = computed(() =>
  route.params.slug
)

/* ==================================================
   REFERENCIA VISOR PDF
================================================== */

/*
ref del contenedor del PDF.
Se usa para hacer scroll automático
al cambiar página.
*/
const pdfViewer = ref(null)

/*
mueve la pantalla suavemente
hacia el inicio del visor PDF
con un pequeño offset superior.
*/
const scrollToPdf = () => {

  if (!pdfViewer.value) return

  /*
  espacio superior para navbar
  o para no pegarlo arriba exacto
  */
  const offset = 90

  /*
  posición absoluta del visor
  */
  const top =
    pdfViewer.value
      .getBoundingClientRect().top +
    window.scrollY -
    offset

  /*
  scroll suave
  */
  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

/* ==================================================
   NORMALIZAR STRINGS
================================================== */

/*
quita slash inicial/final
para comparar slugs correctamente
*/
const normalize = (s) =>
  (s || '')
    .replace(/^\//, '')
    .replace(/\/$/, '')

/* ==================================================
   ESTADO PDF
================================================== */

/*
página actual (empieza en 0)
*/
const currentPage = ref(0)

/*
composable visor PDF
*/
const {
  pages,       // total páginas
  canvases,   // refs canvas DOM
  loadPdf,    // cargar documento
  renderPage,  // render página actual
  zoom
} = usarPdfCapitulo(
  slug,
  currentPage
)

/* ==================================================
   DATOS NOVELAS / CAPÍTULOS
================================================== */

const {
  cargarNovelas
} = usarNovelas()

const {
  capitulos,
  cargarCapitulos,
  obtenerCapitulosByNovela
} = usarCapitulos()

/* ==================================================
   NOVELA ACTUAL SEGÚN SLUG
================================================== */

/*
busca el capítulo actual
y obtiene su novelaId
*/
const novelaId = computed(() => {

  const match =
    capitulos.value.find(c =>
      normalize(c.slug) ===
      normalize(slug.value)
    )

  return match?.novelaId || null
})

/* ==================================================
   CAPÍTULOS DE ESA NOVELA
================================================== */

/*
lista real de capítulos
de la novela actual
*/
const chapters = computed(() => {

  if (!novelaId.value) return []

  return obtenerCapitulosByNovela(
    novelaId.value
  )
})

/* ==================================================
   ÍNDICE DEL CAPÍTULO ACTUAL
================================================== */

/*
posición del capítulo actual
dentro del array chapters
*/
const currentIndex = computed(() => {

  if (!chapters.value.length)
    return -1

  return chapters.value.findIndex(c =>
    normalize(c.slug) ===
    normalize(slug.value)
  )
})

/* ==================================================
   NAVEGACIÓN ENTRE CAPÍTULOS
================================================== */

/*
ir al capítulo anterior
*/
const goPrevChapter = async () => {

  if (currentIndex.value <= 0)
    return

  const nextSlug =
    chapters.value[
      currentIndex.value - 1
    ].slug

  /*
  cambiar ruta
  */
  await router.push({
    name: 'capitulo',
    params: {
      slug: normalize(nextSlug)
    }
  })

  /*
  esperar render Vue
  */
  await nextTick()

  /*
  reiniciar página PDF
  */
  currentPage.value = 0

  /*
  subir al inicio de la vista
  */
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/*
ir al siguiente capítulo
*/
const goNextChapter = async () => {

  const next = nextChapter.value

  if (!nextChapterValid.value) return

  const nextSlug = next.slug

  await router.push({
    name: 'capitulo',
    params: {
      slug: normalize(nextSlug)
    }
  })

  await nextTick()

  currentPage.value = 0
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ==================================================
   NAVEGACIÓN ENTRE PÁGINAS PDF
================================================== */

/*
página anterior
*/
const goPrevPage = () => {

  if (currentPage.value > 0) {

    currentPage.value--

    /*
    subir al inicio del visor
    */
    scrollToPdf()
  }
}

/*
página siguiente
*/
const goNextPage = () => {

  if (
    currentPage.value <
    pages.value.length - 1
  ) {
    currentPage.value++

    scrollToPdf()
  }
}

/* ==================================================
   ESTADOS UI
================================================== */

/*
true si está en página 1
*/
const isFirstPage = computed(() =>
  currentPage.value === 0
)

/*
true si está en última página
*/
const isLastPage = computed(() =>
  currentPage.value ===
  pages.value.length - 1
)

/* ==================================================
   WATCHERS
================================================== */

/*
cuando cambia slug:
cargar nuevo PDF
*/
watch(slug, async () => {
  if (!canLoadChapter.value) return
  await loadPdf()
})

/*
cuando cambia página:
redibujar canvas
*/
watch(currentPage, renderPage)

/* ==================================================
   INIT
================================================== */

/*
al montar componente:
1. cargar novelas
2. cargar capítulos
3. cargar PDF actual
*/
onMounted(async () => {
  loadingPdf.value = true
  await cargarNovelas()

  await cargarCapitulos()

  if (canLoadChapter.value) {
    await loadPdf()
  }
  loadingPdf.value = false
})

/* ==================================================
   NAVBAR
================================================== */

const navItems = [
  {
    label: 'Inicio',
    to: '/inicio'
  },
  {
    label: 'Novelas',
    to: '/novelas'
  }
]
</script>

<template>
  <div class="min-h-screen bg-slate-950 overflow-x-hidden">

    <!-- NAVBAR -->
    <Navbar :nav-items="navItems" />
    <div class="h-16"></div>

    <!-- BACK -->
    <div class="flex justify-between items-center px-6 py-4">
      <BackLink text="Volver a novelas" to="/novelas" />
    </div>

    <!-- =========================
         CARD SUPERIOR (CAPÍTULO)
    ========================== -->
    <div class="px-6 mb-3">
      <div class="max-w-4xl mx-auto rounded-2xl
                  bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-950
                  border border-white/10 backdrop-blur-xl shadow-2xl
                  p-6 space-y-3">

        <div class="text-center">
          <h2 class="text-xl text-white font-semibold">
            {{ chapters[currentIndex]?.title }}
          </h2>
          <p class="text-xs text-amber-300/70 uppercase tracking-widest">
            Capítulo {{ chapters[currentIndex]?.id }}
          </p>
        </div>

        <!-- SOLO NAVEGACIÓN CAPÍTULOS -->
        <div class="flex justify-between gap-3">

          <button @click="goPrevChapter" :disabled="currentIndex === 0"
            class="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl disabled:opacity-30">
            ← Capítulo
          </button>

          <button @click="goNextChapter" :disabled="!nextChapterValid"
            class="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl disabled:opacity-30">
            Capítulo →
          </button>

        </div>

        <!-- FILA PÁGINAS -->
        <div class="flex justify-between items-center gap-3">

          <button @click="goPrevPage" :disabled="isFirstPage"
            class="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-white rounded-xl disabled:opacity-30">
            ← Página
          </button>

          <span class="text-slate-300 text-sm">
            {{ currentPage + 1 }} / {{ pages.length }}
          </span>

          <button @click="goNextPage" :disabled="isLastPage"
            class="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-white rounded-xl disabled:opacity-30">
            Página →
          </button>


        </div>
        <div>
          <p class="md:hidden mt-8 text-slate-400 text-center">Desliza la hoja para leer</p>
        </div>

      </div>

    </div>

    <!-- =========================
         PDF
    ========================== -->
    <div v-show="loadingPdf" class="flex justify-center items-center py-20">
      <div class="text-amber-400 animate-pulse text-sm tracking-widest uppercase">
        Cargando PDF...
      </div>
    </div>
    <div ref="pdfViewer"
      class="w-full h-[78dvh] md:h-full overflow-auto flex justify-start justify-start md:justify-center scroll-smooth overscroll-contain touch-pan-x touch-pan-y md:touch-auto md:overscroll-auto">
      <canvas :ref="el => canvases[0] = el" class="w-full h-auto block mx-auto" />
    </div>

    <!-- =========================
         CARD INFERIOR (TODO CONTROL)
    ========================== -->
    <div class="px-6 mb-3 mt-4">
      <div class="max-w-4xl mx-auto rounded-2xl
                  bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-950
                  border border-white/10 backdrop-blur-xl shadow-2xl
                  p-5 space-y-4">

        <!-- FILA PÁGINAS -->
        <div class="flex justify-between items-center gap-3">

          <button @click="goPrevPage" :disabled="isFirstPage"
            class="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-white rounded-xl disabled:opacity-30">
            ← Página
          </button>

          <span class="text-slate-300 text-sm">
            {{ currentPage + 1 }} / {{ pages.length }}
          </span>

          <button @click="goNextPage" :disabled="isLastPage"
            class="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-white rounded-xl disabled:opacity-30">
            Página →
          </button>

        </div>

      </div>
    </div>

  </div>
</template>