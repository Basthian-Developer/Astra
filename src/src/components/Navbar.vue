<!-- components/Navbar.vue -->
<script setup>
// Importaciones
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { usarNavegacion } from '../composables/usarNavegacion'

// Variables
const menuAbierto = ref(false)
const router = useRouter()

const props = defineProps({
  appName: {
    type: String,
    default: 'Nova Stella'
  },
  navItems: {
    type: Array,
    default: () => []
  }
})

// Funciones

const navegarA = usarNavegacion()

const abrirMenu = async () => {
  menuAbierto.value = !menuAbierto.value

  if (menuAbierto.value) {
    await nextTick()

    gsap.from('.icono-menu', {
      scale: 0.6,
      duration: 0.25
    })

    gsap.from('.menu-movil', {
      y: -20,
      opacity: 0,
      duration: 0.4
    })
  }
}
</script>

<template>
  <nav
    class="fixed w-full z-50 px-4 sm:px-6 md:px-8 py-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md">
    <!--Titulo-->
    <div class="text-3xl md:text-5xl font-bold shadow-2xl tracking-tighter serif text-amber-200">
      {{ props.appName }}
    </div>

    <button class="md:hidden icono-menu" @click="abrirMenu">
      <Bars3Icon v-if="!menuAbierto" class="w-7 h-7 text-amber-200" />
      <XMarkIcon v-else class="w-7 h-7 text-amber-200" />
    </button>

    <!--Botones de navegacion Movil-->
    <div v-if="menuAbierto"
      class="absolute top-full right-4 mt-2 bg-slate-900 p-4 gap-4 rounded flex flex-col menu-movil">
      <button v-for="item in props.navItems" :key="item.to" @click="navegarA(item.to); menuAbierto = false"
        class="uppercase">{{ item.label }}</button>
    </div>


    <!--Botones de navegación PC-->
    <div class="hidden md:flex space-x-8 text-sm uppercase tracking-widest text-slate-400">
      <button v-for="item in props.navItems" :key="item.to" @click="navegarA(item.to)"
        class="uppercase hover:scale-105 transition delay-150">
        {{ item.label }}
      </button>
    </div>
  </nav>
</template>