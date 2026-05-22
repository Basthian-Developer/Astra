import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../libs/supabase'
import { Auth } from '../services/Auth'

// Layouts
const Inicio = () => import('../layouts/Inicio.vue')
const Login = () => import('../layouts/Login.vue')
const AdminDashboard = () => import('../layouts/AdminDashboard.vue')
const UserDashboard = () => import('../layouts/UserDashboard.vue')

// Views

const InicioUserDashboard = () => import('../views/dashboard/Inicio.vue')
const InicioAdminDashboard = () => import('../views/dashboard/admin/Inicio.vue')
const NovelasUserDashboard = () => import('../views/dashboard/Novelas.vue')
const NovelasAdminDashboard = () => import('../views/dashboard/admin/Novelas.vue')
const UsuariosDashboard = () => import('../views/dashboard/Usuarios.vue')

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
                { path: 'inicio', name: 'admin-inicio', component: InicioAdminDashboard },
                { path: 'novelas', name: 'admin-novelas', component: NovelasAdminDashboard },
                { path: 'usuarios', name: 'admin-usuarios', component: UsuariosDashboard }
            ]
        },
        {
            path: '/dashboard/user',
            component: UserDashboard,
            meta: { requiresAuth: true, role: 'user' },
            children: [
                { path: 'inicio', name: 'user-inicio', component: InicioUserDashboard },
                { path: 'novelas', name: 'user-novelas', component: NovelasUserDashboard }
            ]
        }
    ]
})

router.beforeEach(async (to) => {
    const auth = Auth()

    const { data: { session } } =
        await supabase.auth.getSession()

    auth.usuario = session?.user ?? null

    if (!auth.usuario) {
        auth.rol = null
    }

    // SOLO cargar rol si no existe
    if (auth.usuario && !auth.rol) {
        await auth.getRol(auth.usuario.id)
    }


    // no autenticado
    if (to.meta.requiresAuth && !auth.usuario) {
        return '/login'
    }

    // ya autenticado intentando ir a login
    if (auth.usuario && to.path === '/login') {

        return auth.rol === 'admin'
            ? '/dashboard/admin/inicio'
            : '/dashboard/user/inicio'
    }

    // control de roles
    if (
        to.meta.requiresAuth &&
        to.meta.role &&
        to.meta.role !== auth.rol
    ) {

        return auth.rol === 'admin'
            ? '/dashboard/admin/inicio'
            : '/dashboard/user/inicio'
    }

    return true
})

export default router