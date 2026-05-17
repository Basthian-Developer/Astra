import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Inicio from '../layouts/Inicio.vue'
import Login from '../layouts/Login.vue'
import Dashboard from '../layouts/Dashboard.vue'

const routes = [
    {
        path: '/',
        name: 'inicio',
        component: Inicio
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const obtenerUsuarioActual = () => {
    return new Promise((resolve, reject) => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                unsubscribe()
                resolve(user)
            },
            reject
        )

    })
}

router.beforeEach(async (to) => {

    const user = await obtenerUsuarioActual()

    if (to.meta.requiresAuth && !user) {

        return '/login'

    }

})

export default router