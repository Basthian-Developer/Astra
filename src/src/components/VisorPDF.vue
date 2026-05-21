<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    pdf: String
})

const canvasRef = ref(null)

let pdfjsLib = null
let pdfDoc = null

const currentPage = ref(1)
const totalPages = ref(0)

// render de página
async function renderPage(pageNumber) {
    const page = await pdfDoc.getPage(pageNumber)

    const scale = 1.5
    const viewport = page.getViewport({ scale })

    const canvas = canvasRef.value
    const context = canvas.getContext('2d')

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({
        canvasContext: context,
        viewport
    }).promise
}

// carga PDF (LAZY IMPORT AQUÍ)
async function loadPdf() {

    // 🔥 IMPORT DINÁMICO (clave del fix)
    if (!pdfjsLib) {
        pdfjsLib = await import('pdfjs-dist')

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            new URL(
                'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString()
    }

    const loadingTask = pdfjsLib.getDocument(props.pdf)

    pdfDoc = await loadingTask.promise

    totalPages.value = pdfDoc.numPages

    await renderPage(currentPage.value)
}

// navegación
async function nextPage() {
    if (currentPage.value >= totalPages.value) return
    currentPage.value++
    await renderPage(currentPage.value)
}

async function prevPage() {
    if (currentPage.value <= 1) return
    currentPage.value--
    await renderPage(currentPage.value)
}

onMounted(() => {
    loadPdf()
})
</script>

<template>
    <div class="w-full">

        <div class="w-full overflow-auto">
            <canvas ref="canvasRef" class="block max-w-none"></canvas>
        </div>

        <div class="flex gap-4 mt-4 items-center">

            <button
                @click="prevPage"
                class="px-3 py-1 bg-gray-700 text-white rounded"
            >
                Anterior
            </button>

            <span class="text-white">
                {{ currentPage }} / {{ totalPages }}
            </span>

            <button
                @click="nextPage"
                class="px-3 py-1 bg-gray-700 text-white rounded"
            >
                Siguiente
            </button>

        </div>

    </div>
</template>