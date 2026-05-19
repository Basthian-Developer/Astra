import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../libs/supabase'
import { UsarSupabase } from '../services/Auth'

// Layouts
const Inicio = () => import('../layouts/Inicio.vue')
const Login = () => import('../layouts/Login.vue')
const AdminDashboard = () => import('../layouts/AdminDashboard.vue')
const UserDashboard = () => import('../layouts/UserDashboard.vue')

// Views

import InicioDashboard from '../views/dashboard/Inicio.vue'
import NovelasDashboard from '../views/dashboard/Novelas.vue'
import UsuariosDashboard from '../views/dashboard/Usuarios.vue'

// Variables

const { obtenerRol } = UsarSupabase()

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Inicio },
        { path: '/login', component: Login },

        {
            path: '/dashboard/admin',
            component: AdminDashboard,
            meta: { requiresAuth: true, role: 'admin' },
            children: [
                { path: 'inicio', name: 'admin-inicio', component: InicioDashboard },
                { path: 'novelas', name: 'admin-novelas', component: NovelasDashboard },
                { path: 'usuarios', name: 'admin-usuarios', component: UsuariosDashboard }
            ]
        },
        {
            path: '/dashboard/user',
            component: UserDashboard,
            meta: { requiresAuth: true, role: 'user' },
            children: [
                { path: 'inicio', name: 'user-inicio', component: InicioDashboard },
                { path: 'novelas', name: 'user-novelas', component: NovelasDashboard }
            ]
        }
    ]
})

router.beforeEach(async (to) => {

    const { data: { user } } = await supabase.auth.getUser()
    // 🔐 no logueado
    if (to.meta.requiresAuth && !user) {
        return '/login'
    }

    let rol = null

    if (user) {
        rol = await obtenerRol(user.id)
    }

    // 🚪 login si ya está logueado → redirigir por rol
    if (user && to.path === '/login') {

        if (!rol) return '/login'

        return rol === 'admin'
            ? '/dashboard/admin/inicio'
            : '/dashboard/user/inicio'
    }

    // 🧠 control de roles (UN SOLO BLOQUE)
    if (to.meta.requiresAuth && user && to.meta.role) {

        if (!rol) return '/login'

        if (to.meta.role !== rol) {

            return rol === 'admin'
                ? '/dashboard/admin/inicio'
                : '/dashboard/user/inicio'
        }
    }

    return true
})

export default router