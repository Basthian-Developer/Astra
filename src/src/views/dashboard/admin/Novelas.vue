<script setup>
// Importaciones
import { ref, reactive, computed, onMounted } from 'vue'
import { Novelas } from '../../../services/Novelas'
import { Cross } from 'lucide-vue-next'

// Variables
const novelasLength = computed(() => novelas.value.length)
const activeNovelas = computed(() => novelas.value.filter(n => n.estado).length)
const inactiveNovelas = computed(() => novelas.value.filter(n => !n.estado).length)

const novelasService = Novelas()

const novelas = computed(() => novelasService.novelas)

// Preparación de datos
const novelasPreparadas = computed(() =>
    novelas.value.map((n) => ({
        ...n,
        estadoTexto: n.estado ? 'Activo' : 'Inactivo',
        estadoColor: n.estado ? 'bg-green-500' : 'bg-red-500',
        estadoEmision: {
            emision: 'En emisión',
            proximamente: 'Próximamente',
            cancelado: 'Cancelado'
        }[n.desc_estado]
    }))
)

// Filtros
const filtros = reactive({
    nombre: '',
    autor: '',
    estadoActividad: '',
    estadoEmision: ''
})

// Filtro dinámico
const novelasFiltradas = computed(() => {
    return novelasPreparadas.value.filter((n) => {
        const matchNombre =
            n.titulo.toLowerCase().includes(filtros.nombre.toLowerCase())

        const matchAutor =
            n.autor.toLowerCase().includes(filtros.autor.toLowerCase())

        const matchEstadoActividad =
            filtros.estadoActividad === '' ||
            filtros.estadoActividad === 'all' ||
            (filtros.estadoActividad === 'activo' && n.estado) ||
            (filtros.estadoActividad === 'inactivo' && !n.estado)

        const matchEstadoEmision =
            filtros.estadoEmision === '' ||
            filtros.estadoEmision === 'all' ||
            n.desc_estado === filtros.estadoEmision

        return (
            matchNombre &&
            matchAutor &&
            matchEstadoActividad &&
            matchEstadoEmision
        )
    })
})

const eliminarNovela = async (id, estado) => {
    try {
        if(estado === true) throw new Error('No puede eliminarse una novela si esta activa')
        await novelasService.eliminarById(id)
    } catch (error) {
        console.error(error.message)
    }
}

onMounted(async () => {
    await novelasService.getNovelas()
})
</script>

<template>
    <div class="w-full">

        <!-- Título -->
        <h1 class="text-white font-bold text-4xl m-5">
            Novelas
        </h1>

        <hr class="border-0 h-px bg-slate-800 my-5" />

        <!-- Contadores -->
        <div class="p-10 flex gap-5">
            <div
                class="text-white bg-gradient-to-r from-blue-500/80 to-blue-600/80 rounded shadow-2xl w-70 h-30 p-5 flex flex-col gap-2">
                <p class="font-bold text-2xl">Total novelas</p>
                <p class="text-2xl font-bold">{{ novelasLength }}</p>
            </div>

            <div
                class="text-white bg-gradient-to-r from-green-500/80 to-green-600/80 rounded shadow-2xl w-70 h-30 p-5 flex flex-col gap-2">
                <p class="font-bold text-2xl">Novelas activas</p>
                <p class="text-2xl font-bold">{{ activeNovelas }}</p>
            </div>

            <div
                class="text-white bg-gradient-to-r from-red-500/80 to-red-600/80 rounded shadow-2xl w-70 h-30 p-5 flex flex-col gap-2">
                <p class="font-bold text-2xl">Novelas inactivas</p>
                <p class="text-2xl font-bold">{{ inactiveNovelas }}</p>
            </div>
        </div>

        <hr class="border-0 h-px bg-slate-800 my-5" />

        <!-- Filtros -->
        <div class="p-10">
            <div class="bg-slate-800 rounded flex gap-3 p-5">

                <div class="flex flex-col w-1/2">
                    <label class="text-white font-bold mb-1">Nombre</label>
                    <input v-model="filtros.nombre" class="bg-slate-200/80 rounded px-3 py-1" type="text"
                        placeholder="Buscar novela...">
                </div>

                <div class="flex flex-col w-1/2">
                    <label class="text-white font-bold mb-1">Autor</label>
                    <input v-model="filtros.autor" class="bg-slate-200/80 rounded px-3 py-1" type="text"
                        placeholder="Buscar autor...">
                </div>

                <div class="flex flex-col w-1/2">
                    <label class="text-white font-bold mb-1">Estado</label>
                    <select v-model="filtros.estadoActividad" class="bg-slate-200/80 rounded px-3 py-1 text-slate-800">
                        <option value="" disabled>Seleccionar estado</option>
                        <option value="all">Mostrar todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>

                <div class="flex flex-col w-1/2">
                    <label class="text-white font-bold mb-1">Emisión</label>
                    <select v-model="filtros.estadoEmision" class="bg-slate-200/80 rounded px-3 py-1 text-slate-800">
                        <option value="" disabled>Seleccionar estado</option>
                        <option value="all">Mostrar todos</option>
                        <option value="emision">En emisión</option>
                        <option value="proximamente">Por estrenarse</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="flex justify-end px-10 pb-5">
            <button class="bg-gradient-to-r from-green-500 to-green-600 rounded p-1 text-white flex gap-1 items-center">
                <span>
                    <Cross />
                </span><span>Agregar nuevo</span>
            </button>
        </div>


        <!-- Tabla -->
        <div class="px-10">
            <div class="bg-slate-800 rounded p-5">

                <table class="w-full bg-slate-200/80 text-center">

                    <thead class="bg-purple-900 text-white">
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Estado</th>
                            <th>Emisión</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <!-- 🔥 TRANSITION GROUP BIEN USADO -->
                    <TransitionGroup tag="tbody" name="fade-table" class="border-t border-slate-700">
                        <tr v-if="novelas == 0">
                            <td colspan="5" class="h-10">No hay registros</td>
                        </tr>
                        <tr v-else v-for="novela in novelasFiltradas" :key="novela.id"
                            class="table-row border-t border-slate-500">

                            <!-- Título -->
                            <td>{{ novela.titulo }}</td>

                            <!-- Autor -->
                            <td>{{ novela.autor }}</td>

                            <!-- Estado -->
                            <td>
                                <div class="flex items-center justify-center gap-2 h-full">

                                    <span class="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                                        :class="novela.estadoColor"></span>

                                    <span class="w-20 text-left">
                                        {{ novela.estadoTexto }}
                                    </span>

                                </div>
                            </td>

                            <!-- Emisión -->
                            <td class="uppercase">
                                <p class="rounded-2xl text-white text-sm w-30" :class="{
                                    'bg-green-600': novela.desc_estado === 'emision',
                                    'bg-purple-700': novela.desc_estado === 'proximamente',
                                    'bg-red-600': novela.desc_estado === 'cancelado'
                                }">
                                    {{ novela.estadoEmision }}
                                </p>
                            </td>

                            <!-- Acciones -->
                            <td class="flex justify-center gap-3 p-2">
                                <button class="bg-amber-500 rounded px-3 py-1">
                                    Editar
                                </button>
                                <button @click="eliminarNovela(novela.id, novela.estado)" class="bg-red-500 rounded px-3 py-1">
                                    Eliminar
                                </button>
                            </td>

                        </tr>

                    </TransitionGroup>

                </table>

            </div>
        </div>

    </div>
</template>

<style scoped>
/* 🔥 animación limpia sin romper layout */
.fade-table-move,
.fade-table-enter-active,
.fade-table-leave-active {
    transition: all 0.25s ease;
}

.fade-table-enter-from {
    opacity: 0;
    transform: translateY(6px);
}

.fade-table-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* 🔥 clave para evitar “saltos” */
.table-row {
    height: 52px;
}
</style>