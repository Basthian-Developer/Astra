import { ref, nextTick } from 'vue'

/* ==================================================
   CACHE GLOBAL
================================================== */

let pdfjsLib = null
let iniciado = false
let pdfDoc = null

// 🔥 cache real por URL
const pdfCache = new Map()

// 🔥 contexto canvas reutilizable
let ctx = null

/* ==================================================
   INICIALIZAR PDF.JS
================================================== */

async function iniciarPdf() {
    if (iniciado) return

    const pdfjs = await import('pdfjs-dist/build/pdf')
    const pdfWorker = await import('pdfjs-dist/build/pdf.worker?url')

    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker.default

    pdfjsLib = pdfjs
    iniciado = true
}

/* ==================================================
   COMPOSABLE
================================================== */

export function usarPdfCapitulo(slug, currentPage) {

    const pages = ref([])
    const canvases = []

    /* ==================================================
       URL PDF
    ================================================== */

    const getPdfUrl = () =>
        `${import.meta.env.BASE_URL}documentos/${slug.value}.pdf`

    /* ==================================================
       RENDER PAGE
    ================================================== */

    const renderPage = async () => {
        try {
            if (!pdfDoc) return

            const page = await pdfDoc.getPage(currentPage.value + 1)

            const canvas = canvases[0]
            if (!canvas) return

            if (!ctx) {
                ctx = canvas.getContext('2d')
            }

            const baseViewport = page.getViewport({ scale: 1 })

            const screenWidth = window.innerWidth
            const padding = 32

            const maxWidth =
                window.innerWidth >= 768
                    ? 900
                    : screenWidth
            const targetWidth = Math.min(
                screenWidth - padding,
                maxWidth
            )

            const scale = targetWidth / baseViewport.width

            const viewport = page.getViewport({ scale })

            // 🔥 reducir carga en móviles
            const isMobile = window.innerWidth < 768

            const dpr = isMobile
                ? Math.min(window.devicePixelRatio || 1, 2)
                : (window.devicePixelRatio || 1)

            canvas.width = Math.floor(viewport.width * dpr)
            canvas.height = Math.floor(viewport.height * dpr)

            canvas.style.width = `${viewport.width}px`
            canvas.style.height = `${viewport.height}px`

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)

            await page.render({
                canvasContext: ctx,
                viewport
            }).promise

        } catch (err) {
            console.error('Error renderizando página:', err)
        }
    }

    /* ==================================================
       LOAD PDF
    ================================================== */

    const loadPdf = async () => {
        try {
            await iniciarPdf()

            const url = getPdfUrl()

            pages.value = []
            canvases.length = 0

            // 🔥 CACHE REAL
            if (pdfCache.has(url)) {
                pdfDoc = pdfCache.get(url)
            } else {
                pdfDoc = await pdfjsLib.getDocument(url).promise
                pdfCache.set(url, pdfDoc)
            }

            pages.value = Array.from(
                { length: pdfDoc.numPages },
                (_, i) => i + 1
            )

            await nextTick()
            await renderPage()

        } catch (err) {
            console.error('Error cargando PDF:', err)
        }
    }

    /* ==================================================
       RETURN
    ================================================== */

    return {
        pages,
        canvases,
        loadPdf,
        renderPage
    }
}