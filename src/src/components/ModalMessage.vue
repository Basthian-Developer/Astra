<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

// Variables
const props = defineProps({
    modal: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

const modalRef = ref(null)

// Funciones
const cerrar = () => {
    emit('close')
}

const confirmar = () => {
    emit('confirm')
}

const cancelar = () => {
    emit('cancel')
}

onMounted(() => {
    gsap.from(modalRef.value, {
        opacity: 0,
        duration: 0.25
    })
})
</script>

<template>
    <div v-if="modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <!-- Modal -->
        <div ref="modalRef" class="bg-white/10  backdrop-blur-xl border border-white/20 rounded-xl p-6 w-[400px] shadow-2xl text-white">

            <!-- Header -->
            <div class="flex justify-between items-center mb-4">

                <h2 class="text-2xl text-purple-500 font-bold">
                    {{ modal.titulo }}
                </h2>

                <button @click="cerrar">
                    ✕
                </button>

            </div>

            <!-- Content -->
            <div class="mb-6">

                <p class="text-white/70 hover:text-white">
                    {{ modal.desc }}
                </p>

            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3">

                <div v-if="modal.cancelar">
                    <button @click="cancelar" class="px-4 py-2 rounded bg-gray-300">
                        Cancelar
                    </button>
                </div>
                <div v-if="modal.confirmar">
                    <button @click="confirmar" class="px-4 py-2 rounded bg-purple-500 text-white">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>