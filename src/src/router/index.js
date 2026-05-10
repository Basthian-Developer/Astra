import { createRouter, createWebHashHistory } from "vue-router";

import Inicio from '../layouts/Inicio.vue'
import Novelas from '../layouts/Novelas.vue'
import Capitulo from '../components/Capitulo.vue'

// Novelas
//===========================================================================
import Samurai_Olvidado from '../layouts/novelas/Samurai-Olvidado.vue'

//===========================================================================
import Hermanos_Y_Sangre from '../layouts/novelas/Hermanos-y-sangre.vue'

// Capitulos

//===========================================================================
import Caminos_Gloria from '../layouts/novelas/Caminos-gloria.vue'




const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/inicio'
        },
        {
            path: '/inicio',
            name: 'inicio',
            component: Inicio
        },
        {
            path: '/novelas',
            name: 'novelas',
            component: Novelas
        },
        {
            path: '/novelas/samurai-olvidado',
            name: 'samurai-olvidado',
            component: Samurai_Olvidado
        },
        {
            path: '/novelas/hermanos-y-sangre',
            name: 'hermanos-y-sangre',
            component: Hermanos_Y_Sangre
        },
        {
            path: '/novelas/caminos-gloria',
            name: 'caminos-gloria',
            component: Caminos_Gloria
        },
        {
            path: '/capitulo/:slug',
            name: 'capitulo',
            component: Capitulo
        }
    ]
});

export default router;