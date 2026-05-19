import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../libs/supabase'

// Layouts
import Inicio from '../layouts/Inicio.vue'
import Login from '../layouts/Login.vue'
import AdminDashboard from '../layouts/AdminDashboard.vue'
import UserDashboard from '../layouts/UserDashboard.vue'

// Views

import InicioDashboard from '../views/dashboard/Inicio.vue'
import NovelasDashboard from '../views/dashboard/Novelas.vue'
import UsuariosDashboard from '../views/dashboard/Usuarios.vue'

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
                {path: 'inicio', name: 'inicio', component: InicioDashboard},
                {path: 'novelas', name: 'novelas', component: NovelasDashboard},
                {path: 'usuarios', name: 'usuarios', component: UsuariosDashboard}
            ]
        },
        {
            path: '/dashboard/user',
            component: UserDashboard,
            meta: { requiresAuth: true, role: 'user' },
            children: [
                {path: 'inicio', name: 'inicio', component: InicioDashboard},
                {path: 'novelas', name: 'novelas', component: NovelasDashboard}
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

    // 🚪 login si ya está logueado → redirigir por rol
    if (user && to.path === '/login') {

        const { data: profile } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', user.id)
            .maybeSingle()

        return profile?.rol === 'admin'
            ? '/dashboard/admin/inicio'
            : '/dashboard/user/inicio'
    }

    // 🧠 control de roles (UN SOLO BLOQUE)
    if (to.meta.requiresAuth && user && to.meta.role) {

        const { data: profile } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', user.id)
            .maybeSingle()

        if (!profile) return '/login'

        if (to.meta.role !== profile.rol) {
            return profile.rol === 'admin'
                ? '/dashboard/admin/inicio'
                : '/dashboard/user/inicio'
        }
    }

    return true
})

export default router