import {createRouter, createWebHistory} from 'vue-router'

import Inicio from '../layouts/Inicio.vue'

const routes = [
    {
        path: '/',
        name: 'inicio',
        component: Inicio
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router