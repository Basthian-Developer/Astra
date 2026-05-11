import { ref, nextTick } from 'vue'

/* ==================================================
   VARIABLES GLOBALES DEL MÓDULO
================================================== */

/*
pdfjsLib:
guarda la librería pdfjs ya importada dinámicamente.
Se mantiene en memoria para no volver a importarla.
*/
let pdfjsLib = null

/*
iniciado:
bandera para saber si pdfjs ya fue inicializado.
Evita repetir imports y configuración del worker.
*/
let iniciado = false

/*
pdfDoc:
almacena el documento PDF actualmente abierto.
Así no se vuelve a cargar al cambiar página.
*/
let pdfDoc = null

/* ==================================================
   INICIALIZAR PDF.JS SOLO UNA VEZ
================================================== */

async function iniciarPdf() {

    // si ya fue inicializado antes, salir
    if (iniciado) return

    /*
    import dinámico:
    carga pdfjs solo cuando se necesita.
    Reduce peso inicial de la app.
    */
    const pdfjs = await import('pdfjs-dist')

    /*
    worker del PDF:
    procesa parsing/render en segundo hilo
    para no bloquear la interfaz.
    */
    const pdfWorker =
        await import('pdfjs-dist/build/pdf.worker?url')

    /*
    indicar a pdfjs dónde está el worker.
    */
    pdfjs.GlobalWorkerOptions.workerSrc =
        pdfWorker.default

    /*
    guardar librería cargada
    */
    pdfjsLib = pdfjs

    /*
    marcar como iniciado
    */
    iniciado = true
}

/* ==================================================
   COMPOSABLE PRINCIPAL
================================================== */

export function usarPdfCapitulo(slug, currentPage) {

    /*
    pages:
    array reactivo para cantidad de páginas.
    Ejemplo: [1,2,3,4]
    Se usa en el template.
    */
    const pages = ref([])

    /*
    canvases:
    refs reales de los canvas del DOM.
    Vue los llena mediante :ref
    */
    const canvases = []

    /* ----------------------------------------------
       CONSTRUIR URL DEL PDF SEGÚN SLUG
    ---------------------------------------------- */

    const getPdfUrl = () =>
        `${import.meta.env.BASE_URL}documentos/${slug.value}.pdf`

    /* ==================================================
       RENDERIZAR SOLO LA PÁGINA ACTUAL
    ================================================== */

    const renderPage = async () => {
        try {
            if (!pdfDoc) return

            const page =
                await pdfDoc.getPage(currentPage.value + 1)

            const canvas = canvases[0]
            if (!canvas) return

            const context = canvas.getContext('2d')

            /*
            viewport base sin escala
            */
            const baseViewport = page.getViewport({
                scale: 1
            })

            /*
            ancho disponible pantalla
            */
            const screenWidth = window.innerWidth

            /*
            márgenes laterales
            */
            const padding = 32

            /*
            ancho máximo escritorio
            */
            const maxWidth = 900

            /*
            ancho final permitido
            */
            const targetWidth = Math.min(
                screenWidth - padding,
                maxWidth
            )

            /*
            escala automática
            */
            const scale =
                targetWidth / baseViewport.width

            /*
            viewport final
            */
            const viewport = page.getViewport({
                scale
            })

            canvas.width = viewport.width
            canvas.height = viewport.height

            await page.render({
                canvasContext: context,
                viewport
            }).promise

        } catch (err) {
            console.error(
                'Error renderizando página:',
                err
            )
        }
    }

    /* ==================================================
       CARGAR PDF COMPLETO (SOLO CAMBIO DE CAPÍTULO)
    ================================================== */

    const loadPdf = async () => {
        try {

            /*
            asegurar que pdfjs esté listo
            */
            await iniciarPdf()

            /*
            limpiar estado anterior
            */
            pages.value = []
            canvases.length = 0

            /*
            abrir nuevo documento PDF
            */
            pdfDoc = await pdfjsLib
                .getDocument(getPdfUrl())
                .promise

            /*
            crear array según número de páginas
            Ejemplo: [1,2,3,4,5]
            */
            pages.value = Array.from(
                { length: pdfDoc.numPages },
                (_, i) => i + 1
            )

            /*
            esperar a que Vue monte el canvas
            */
            await nextTick()

            /*
            renderizar primera página
            o página actual.
            */
            await renderPage()

        } catch (err) {
            console.error(
                'Error cargando PDF:',
                err
            )
        }
    }

    /* ==================================================
       RETORNO DEL COMPOSABLE
    ================================================== */

    return {
        pages,       // páginas disponibles
        canvases,    // refs canvas
        loadPdf,     // cargar nuevo PDF
        renderPage   // cambiar página actual
    }
}