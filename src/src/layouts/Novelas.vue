<script setup>
import { ref, nextTick, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import BackLink from '../components/BackLink.vue'
import { usarNovelas } from '../composables/usarNovelas'

const router = useRouter()
const { novelas, cargarNovelas } = usarNovelas()

const searchName = ref("")
const searchAuthor = ref("")
const cargando = ref(true)

const hoverIn = (e) => {
  gsap.to(e.currentTarget, { y: -8, scale: 1.02, duration: 0.3 })
}

const hoverOut = (e) => {
  gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3 })
}

const coincideTitulo = (n) => (n.titulo ?? "").toLowerCase().includes(searchName.value.toLowerCase())

const coincideAutor = (n) => !searchAuthor.value || (n.autor ?? "").toLowerCase().includes(searchAuthor.value.toLowerCase())

const filteredNovels = computed(() =>
  novelas.value.filter(n => coincideTitulo(n) && coincideAutor(n))
)

const abrirNovela = (ruta) => {
  router.push(ruta)
}

watch(filteredNovels, async () => {
  await nextTick()

  const cards = gsap.utils.toArray(".novel-card")
  if (!cards.length) return

  gsap.fromTo(cards,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.03 }
  )
})

const navItems = [
  { label: "Inicio", to: "/inicio" }
]

onMounted(async () => {
  try {
    await cargarNovelas()
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden font-sans bg-slate-950 text-slate-200">

    <!-- NAVBAR -->
    <Navbar :nav-items="navItems" />

    <main class="pt-28 px-6 max-w-screen-xl mx-auto min-h-screen">

      <div class="mb-10 flex flex-col items-start">

        <BackLink text="Volver al inicio" to="/inicio" />

        <div class="space-y-2">
          <h2 class="text-2xl md:text-3xl font-light text-white tracking-tight">
            Catálogo de <span class="text-amber-200 font-semibold">Novelas</span>
          </h2>
          <p class="text-sm text-slate-500 max-w-md leading-relaxed">
            Explora nuestra colección de historias. Utiliza los filtros de abajo para encontrar tu próxima aventura
            estelar.
          </p>
        </div>

      </div>

      <!-- FILTROS -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">

          <input v-model="searchName" placeholder="Buscar título..."
            class="bg-black/40 p-3 rounded-lg border border-slate-800 focus:border-amber-200 outline-none text-slate-200">

          <input v-model="searchAuthor" placeholder="Autor..."
            class="bg-black/40 p-3 rounded-lg border border-slate-800 focus:border-amber-200 outline-none text-slate-200">
        </div>
      </section>

      <!-- GRID -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20 auto-rows-fr">

        <div v-if="cargando" class="text-center text-slate-500 py-20 col-span-full">
          Cargando novelas...
        </div>

        <div v-else-if="filteredNovels.length === 0" class="text-center text-slate-500 py-20 col-span-full">
          No hay novelas que coincidan 😔
        </div>

        <div v-for="novel in filteredNovels" :key="novel.id" @mouseenter="hoverIn" @mouseleave="hoverOut"
          class="novel-card h-full flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden p-5 hover:border-amber-200/30 transition">

          <div class="flex flex-col flex-1 mb-4">

            <div class="aspect-square bg-gradient-to-tr from-slate-800 to-slate-700 rounded-lg mb-4 overflow-hidden">
              <img v-if="novel.imagen" :src="novel.imagen" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center opacity-30">
                <span>Sin imagen</span>
              </div>
            </div>

            <span class="text-[10px] uppercase tracking-widest text-amber-200/60">
              {{ novel.estado }} • {{ novel.year }}
            </span>

            <div class="flex flex-col gap-1 min-h-[6.3rem]">
              <h2 class="text-lg font-semibold text-white leading-tight line-clamp-2 m-0 p-0">
                {{ novel.titulo }}
              </h2>

              <p class="text-[11px] text-slate-500 leading-tight m-0 p-0">
                por {{ novel.autor }}
              </p>

              <p class="text-xs text-slate-400 leading-snug line-clamp-3 m-0 p-0">
                {{ novel.desc }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-800/40 mt-2">
              <span v-for="t in novel.tags" :key="t" class="text-[10px] px-2 py-1 leading-none flex items-center
           border border-amber-200/20 text-amber-200 rounded-full whitespace-nowrap">
                {{ t }}
              </span>
            </div>

          </div>

          <button @click="abrirNovela(novel.info.ruta)" class="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest
  bg-gradient-to-r from-amber-200 to-amber-500 text-slate-950
  hover:from-amber-300 hover:to-amber-600
  transition-all active:scale-95 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
            Leer novela
          </button>
        </div>
      </section>
    </main>

    <Footer />

  </div>
</template>