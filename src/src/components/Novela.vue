<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import BackLink from './BackLink.vue'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const router = useRouter()

// ← NUEVA FUNCIÓN para hacer scroll suave
const scrollToChapters = () => {
    const chaptersSection = document.getElementById('chapters-section')
    if (chaptersSection) {
        gsap.to(window, {
            duration: 1.0,
            scrollTo: {
                y: chaptersSection,
                offsetY: 100 // Un poco de espacio desde arriba
            },
            ease: "power3.inOut"
        })
    }
}

const openChapter = (ch) => {
    if (!ch.slug || ch.slug === '#') return

    router.push({
        name: 'capitulo',
        params: { slug: ch.slug }
    })
}

// DEFINICIÓN DE PROPS
const props = defineProps({
    title: { type: String, default: "Título de la Obra" },
    author: { type: String, default: "Autor Desconocido" },
    status: { type: String, default: "Indefinido" },
    synopsis: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    chapters: { type: Array, default: () => [] }
})

const order = ref('asc')
const sortedChapters = ref([])
const isScrolled = ref(false)

// Timelines para limpieza
let heroTl = null

// SORT LOGIC
function sortChapters(newOrder) {
    order.value = newOrder
    sortedChapters.value = [...props.chapters].sort((a, b) =>
        newOrder === 'asc' ? a.id - b.id : b.id - a.id
    )
    animateChapters()
}

function animateChapters() {
    nextTick(() => {
        const items = gsap.utils.toArray(".chapter-item");
        if (items.length === 0) return;
        gsap.killTweensOf(items);
        gsap.fromTo(items,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, stagger: 0.06, duration: 0.5,
                ease: "power3.out", overwrite: true, clearProps: "all"
            }
        );
    });
}

function handleScroll() {
    isScrolled.value = window.scrollY > 50
}

const navItems = [
    { label: "Inicio", to: "/inicio" },
    { label: "Novelas", to: "/novelas" }
]

// Inicializar y Animar
onMounted(async () => {
    sortedChapters.value = [...props.chapters]
    window.addEventListener('scroll', handleScroll)

    await nextTick()

    heroTl = gsap.timeline()
    heroTl
        .from("#navbar", { y: -100, opacity: 0, duration: 1.2, ease: "expo.out" })
        .from("#hero-image", { opacity: 0, x: -30, duration: 1.5, ease: "power4.out" }, "-=0.8")
        .from("#hero-content > *", { opacity: 0, y: 30, stagger: 0.15, duration: 1, ease: "power3.out" }, "-=1.2")

    gsap.from("#chapters-section", {
        scrollTrigger: {
            trigger: "#chapters-section",
            start: "top 85%",
            toggleActions: "play none none none"
        },
        opacity: 0, y: 50, duration: 1.2, ease: "power3.out"
    })

    animateChapters()
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    if (heroTl) heroTl.kill()
    ScrollTrigger.getAll().forEach(t => t.kill())
})

// Si los capítulos cambian externamente, actualizamos la lista
watch(() => props.chapters, (newVal) => {
    sortedChapters.value = [...newVal]
    animateChapters()
}, { deep: true })
</script>

<template>
    <div class="text-slate-300 overflow-x-hidden bg-slate-950 selection:bg-amber-500/30 min-h-screen">

        <div class="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
            <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-amber-500/10 blur-[160px] rounded-full">
            </div>
            <div class="absolute top-[20%] -right-[10%] w-[50%] h-[60%] bg-violet-600/10 blur-[180px] rounded-full">
            </div>
        </div>

        <Navbar id="navbar" :nav-items="navItems" />

        <main class="pt-40 pb-20 px-6">
            <BackLink text="Volver a novelas" to="/novelas" />
            <div class="max-w-7xl mx-auto">

                <section class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32">
                    <div id="hero-image" class="relative group shrink-0">
                        <div
                            class="absolute -inset-2 bg-gradient-to-r from-amber-500 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000">
                        </div>
                        <div
                            class="relative aspect-[3/4] w-64 lg:w-72 overflow-hidden rounded-xl shadow-2xl bg-slate-900 border border-white/10">
                            <img :src="coverImage"
                                class="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100" />
                        </div>
                    </div>

                    <div id="hero-content" class="flex flex-col space-y-6 flex-1 text-center lg:text-left">
                        <div>
                            <h2
                                class="text-5xl lg:text-7xl font-bold mb-2 leading-[1.1] tracking-tight bg-gradient-to-b from-white via-amber-100 to-slate-300 bg-clip-text text-transparent italic serif">
                                {{ title }}
                            </h2>
                            <p class="text-amber-400 font-medium tracking-[0.2em] uppercase text-sm mt-4 italic">
                                Por {{ author }}
                            </p>
                        </div>

                        <div class="flex justify-center lg:justify-start">
                            <span :class="[
                                'px-4 py-1 text-xs uppercase tracking-widest rounded-full font-bold text-white shadow-lg',
                                status === 'En curso'
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-600 shadow-green-500/30'
                                    : status === 'Proximamente'
                                        ? 'bg-gradient-to-r from-purple-400 to-violet-600 shadow-purple-500/30'
                                        : 'bg-gradient-to-r from-slate-500 to-slate-700 shadow-slate-500/20'
                            ]">
                                {{ status }}
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-2 py-2 justify-center lg:justify-start">
                            <span v-for="tag in tags" :key="tag"
                                class="px-3 py-1 text-[10px] uppercase tracking-widest border border-white/10 bg-white/5 rounded-full text-slate-300">
                                {{ tag }}
                            </span>
                        </div>

                        <p class="text-lg text-slate-400 leading-relaxed max-w-2xl font-light whitespace-pre-line">
                            {{ synopsis }}
                        </p>

                        <div class="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
                            <button @click="scrollToChapters"
                                class="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:-translate-y-1 transition-all">
                                Empezar a leer
                            </button>
                        </div>
                    </div>
                </section>

                <hr class="border-white/5 mb-24" />

                <section id="chapters-section" class="max-w-4xl mx-auto">
                    <div class="flex flex-col md:flex-row justify-between md:items-end items-stretch mb-12 gap-6 w-full overflow-hidden">
                        <div>
                            <h3 class="text-3xl font-bold text-white mb-2 tracking-tight">Índice de Capítulos</h3>
                            <p class="text-slate-500 text-sm italic">Explora la progresión de la historia</p>
                        </div>

                        <div class="flex justify-center bg-white/5 p-1 rounded-lg border border-white/10">
                            <button @click="sortChapters('asc')"
                                :class="['px-4 py-2 text-xs uppercase tracking-widest rounded-md transition-all', order === 'asc' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400']">Ascendente</button>
                            <button @click="sortChapters('desc')"
                                :class="['px-4 py-2 text-xs uppercase tracking-widest rounded-md transition-all', order === 'desc' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400']">Descendente</button>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <!-- SI NO HAY CAPÍTULOS -->
                        <div v-if="!sortedChapters.length"
                            class="text-center py-16 border border-white/5 rounded-xl bg-slate-900/30">
                            <p class="text-slate-400 text-lg italic">
                                No hay capítulos disponibles por el momento.
                            </p>
                        </div>

                        <!-- SI HAY CAPÍTULOS -->
                        <div v-else>
                            <div v-for="ch in sortedChapters" :key="ch.id"
                                class="chapter-item group flex items-center justify-between p-6 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/70 hover:border-amber-500/30 transition-all duration-500">

                                <div class="flex items-center gap-6">

                                    <span class="text-amber-400 font-mono text-sm">
                                        {{ ch.numeroCapitulo.toString().padStart(2, '0') }}
                                    </span>

                                    <div class="flex items-center gap-3">
                                        <h4
                                            class="text-lg text-slate-200 group-hover:text-white transition-colors italic">
                                            {{ ch.title }}
                                        </h4>

                                        <span :class="[
                                            'px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-full font-bold text-white',
                                            ch.estado === 'Emitido'
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-600 shadow-green-500/30'
                                                : ch.estado === 'No disponible'
                                                    ? 'bg-gradient-to-r from-red-400 to-rose-600 shadow-red-500/30'
                                                    : ch.estado === 'En prueba'
                                                        ? 'bg-gradient-to-r from-orange-400 to-amber-600 shadow-orange-500/30'
                                                        : ch.estado === 'Próximamente'
                                                            ? 'bg-gradient-to-r from-violet-500 to-purple-700 shadow-purple-500/30'
                                                            : 'bg-slate-600'
                                        ]">
                                            {{ ch.estado }}
                                        </span>
                                    </div>

                                </div>

                                <button @click="openChapter(ch)"
                                    class="px-5 py-2 text-xs uppercase tracking-widest font-bold border border-white/10 rounded-full group-hover:bg-amber-500 group-hover:text-black transition-all">
                                    Leer
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <Footer />
    </div>
</template>

<style scoped>
.serif {
    font-family: 'Playfair Display', serif;
}
</style>