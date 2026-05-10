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

            /*
            si no hay documento cargado,
            no se puede renderizar.
            */
            if (!pdfDoc) return

            /*
            currentPage empieza en 0
            pdfjs empieza en 1
            */
            const page =
                await pdfDoc.getPage(currentPage.value + 1)

            /*
            viewport:
            tamaño y escala del render.
            scale 1.5 = mejor resolución.
            */
            const viewport = page.getViewport({
                scale: 1.5
            })

            /*
            usamos solo el primer canvas.
            El canvas permanece montado y solo cambia su dibujo.
            */
            const canvas = canvases[0]

            /*
            si el canvas aún no existe en DOM
            salir sin error.
            */
            if (!canvas) return

            /*
            contexto 2D del canvas
            */
            const context = canvas.getContext('2d')

            /*
            ajustar tamaño real del canvas
            al tamaño de la página PDF.
            */
            canvas.width = viewport.width
            canvas.height = viewport.height

            /*
            dibujar página en canvas
            */
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