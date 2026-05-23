<script setup>
// Importaciones
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import gsap from 'gsap';
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

// Variables
const props = defineProps({
    modal: {
        type: Object,
        default: null
    },
})

const novela = reactive({
    titulo: '',
    autor: '',
    desc_estado: '',
    tags: [],
    sinopsis: '',
    estado: true,
    ruta: '#'
})

const error = reactive({
    tituloError: '',
    autorError: '',
    estadoError: '',
    tagsError: '',
    sinopsisError: '',
    imagenError: ''
})

const imagen = ref(null)

const opciones = ["Fanfic", "Original", "Drama", "Accion", "Suspenso", "Ciencia ficción"]

const isValid = ref(false)

const emit = defineEmits(['close', 'confirm', 'cancel'])

const regexTexto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,]+$/

const modalRef = ref(null)
let ctx = null

// Funciones
const cambiarImagen = (event) => {
    const file = event.target.files[0]

    if (!file) return

    imagen.value = file
}

const cerrar = () => {
    emit('close')
}

const confirmar = () => {
    validar()

    if (!isValid.value) return

    emit('confirm', {
        novela: {
            ...novela
        },
        imagenFile: imagen.value
    })
}

const cancelar = () => {
    emit('cancel')
}

const validar = () => {
    isValid.value = true

    if (novela.titulo === '') {
        error.tituloError = 'No se pueden ingresar campos vacios'
        isValid.value = false
    }
    else if (!regexTexto.test(novela.titulo)) {
        error.tituloError = 'No se pueden ingresar caracteres invalidos'
        isValid.value = false
    }
    else {
        error.tituloError = ''
    }

    if (novela.autor === '') {
        error.autorError = 'No se pueden ingresar campos vacios'
        isValid.value = false
    }
    else if (!regexTexto.test(novela.autor)) {
        error.autorError = 'No se pueden ingresar caracteres invalidos'
        isValid.value = false
    }
    else {
        error.autorError = ''
    }

    if (novela.desc_estado === '') {
        error.estadoError = 'Debe seleccionar una opción'
        isValid.value = false
    }
    else {
        error.estadoError = ''
    }

    if (novela.tags.length === 0) {
        error.tagsError = 'Debe seleccionar las etiquetas'
        isValid.value = false
    }
    else {
        error.tagsError = ''
    }

    if (novela.sinopsis === '') {
        error.sinopsisError = 'No pueden ingresar campos vacios'
        isValid.value = false
    }
    else if (!regexTexto.test(novela.sinopsis)) {
        error.sinopsisError = 'No se pueden ingresar caracteres ilegales'
        isValid.value = false
    }
    else {
        error.sinopsisError = ''
    }

    if (!imagen.value) {
        error.imagenError = 'Debe ingresar una imagen para continuar'
        isValid.value = false
    }
    else {
        const tiposPermitidos = [
            'image/jpeg',
            'image/jpg',
            'image/webp'
        ]

        if (!tiposPermitidos.includes(imagen.value.type)) {
            error.imagenError = 'La imagen no tiene el formato permitido'
            isValid.value = false
        }
        else if (imagen.value.size > 2 * 1024 * 1024) {
            error.imagenError = 'La imagen no debe superar 2MB'
            isValid.value = false
        }
        else {
            error.imagenError = ''
        }
    }
}

onMounted(() => {
    ctx = gsap.context(() => {

    })
})

onUnmounted(() => {
    ctx?.revert()
})
</script>

<template>
    <div v-if="modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div ref="modalRef"
            class="bg-white/10  backdrop-blur-xl border border-white/20 rounded-xl p-6 w-[700px] shadow-2xl text-white">
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
                <div class="flex flex-row gap-5 justify-center">
                    <div class="w-2/4 space-y-3">
                        <!--Titulo-->
                        <div class="flex flex-col">
                            <label for="">Titulo*</label>
                            <input v-model="novela.titulo" type="text" placeholder="Ingresar titulo de la novela"
                                class="bg-slate-300 text-slate-900 rounded p-1" />
                            <p class="text-red-400 text-sm min-h-[20px]">{{ error.tituloError }}</p>
                        </div>
                        <!--Estado-->
                        <div class="flex flex-col">
                            <label for="">Estado de emisión*</label>
                            <select v-model="novela.desc_estado" class="bg-slate-300 text-slate-900 rounded p-1 h-10">
                                <option value="" disabled>Seleccionar el estado</option>
                                <option value="emision">En emisión</option>
                                <option value="proximamente">Próximamente</option>
                            </select>
                            <p class="text-red-400 text-sm min-h-[20px]">{{ error.estadoError }}</p>
                        </div>

                        <!--Sinopsis-->
                        <div class="flex flex-col">
                            <label for="">Sinopsis*</label>
                            <textarea v-model="novela.sinopsis" rows="5" placeholder="Ingresar la sinopsis de la novela"
                                class="bg-slate-300 text-slate-900 rounded p-1 resize-none" />
                            <p class="text-red-400 text-sm min-h-[20px]">{{ error.sinopsisError }}</p>
                        </div>
                    </div>
                    <div class="w-2/4 space-y-3">
                        <!--Autor-->
                        <div class="flex flex-col">
                            <label for="">Autor*</label>
                            <input v-model="novela.autor" type="text" placeholder="Ingresar autor de la novela"
                                class="bg-slate-300 text-slate-900 rounded p-1" />
                            <p class="text-red-400 text-sm min-h-[20px]">{{ error.autorError }}</p>
                        </div>
                        <!--Tags-->
                        <div class="flex flex-col">
                            <label for="">Etiquetas* <span class="text-amber-500">(Seleccion multiple)</span></label>
                            <Multiselect v-model="novela.tags" mode="tags" :close-on-select="false" :searchable="true"
                                :create-option="false" :options="opciones"
                                placeholder="Haz click para seleccionar etiquetas" />
                            <p class="text-red-400 text-sm min-h-[20px]">{{ error.tagsError }}</p>
                        </div>

                        <!--Imagen-->
                        <div class="flex flex-col gap-2">
                            <label class="font-medium">Imagen*</label>

                            <label for="imagen"
                                class="cursor-pointer flex items-center justify-center h-24 border-2 border-dashed border-purple-400/60 rounded-xl bg-white/5 hover:bg-white/10 transition">

                                <div class="text-center">
                                    <p class="text-sm font-semibold text-purple-300">
                                        Seleccionar archivo
                                    </p>

                                    <p class="text-xs text-white/50 mt-1">
                                        Formato WEBP, JPG, JPEG
                                    </p>
                                </div>

                                <input id="imagen" @change="cambiarImagen" type="file"
                                    accept="image/webp, image/jpeg, image/jpg" class="hidden" />
                            </label>

                            <div v-if="imagen"
                                class="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 truncate">
                                {{ imagen.name }}
                            </div>
                            <p class="text-red-400 text-sm min-h-[20px]">{{ error.imagenError }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3">

                <div v-if="modal.cancelar">
                    <button @click="cancelar"
                        class="px-4 py-2 rounded bg-gray-500 hover:scale-105 transition duration-200">
                        Cancelar
                    </button>
                </div>
                <div v-if="modal.confirmar">
                    <button @click="confirmar"
                        class="px-4 py-2 rounded bg-purple-500 text-white hover:scale-105 transition duration-200">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.multiselect) {
    background: rgb(203 213 225);
    border-radius: 0.375rem;
    color: rgb(15 23 42);
}

:deep(.multiselect-dropdown) {
    background: rgb(203 213 225);
    color: rgb(15 23 42);
}

:deep(.multiselect-option) {
    color: rgb(15 23 42);
}

:deep(.multiselect-option.is-selected) {
    background: rgb(147 51 234);
    color: white;
}

:deep(.multiselect-tags-search) {
    background: transparent;
    color: rgb(15 23 42);
}
</style>