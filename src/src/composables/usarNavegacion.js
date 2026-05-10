import {useRouter} from 'vue-router'

export function usarNavegacion() {
    const router = useRouter()
    
    const navegarA = (item) => {
        if (!item) return

        if (item.startsWith('/') && item.length > 1) {
            router.push(item)
            window.scrollTo({top: 0, behavior: 'smooth'})
        } else if (item.startsWith('#') && item.length > 1) {
            const seccion = document.querySelector(item)

            if (seccion) {
                seccion.scrollIntoView({
                    behavior: 'smooth'
                })
            }
        }
    }

    return navegarA
}