<script setup>
// Importaciones
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { Auth } from '../services/Auth.js'

// Componentes
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Modal from '../components/Modal.vue'

const auth = Auth()

// Variables
let email = ref('')
let pass = ref('')
let isValid = ref(false)

let emailError = ref('')
let passError = ref('')

const modal = ref(null)

const router = useRouter()

let ctx // Importante para limpieza de animaciones gsap

const sanitizarCampos = () => {
    const emailValue = email.value
    const emailLimpio = emailValue.replace(/\s+/g, '')
    email.value = emailLimpio

    const passValue = pass.value
    const passLimpio = passValue.replace(/\s+/g, '')
    pass.value = passLimpio
}

// Funciones
const validarCampos = () => {
    isValid.value = true
    emailError.value = ''
    passError.value = ''

    const regexCaracteres = /^[a-zA-Z0-9@._-]+$/
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPass = /^[A-Za-z\d@$!%*?&._-]+$/

    const emailValue = email.value
    const passValue = pass.value

    if (emailValue === '') {
        emailError.value = 'El campo del correo no puede quedar vacio'
        isValid.value = false
    }
    else if (!regexCaracteres.test(emailValue)) {
        emailError.value = 'No se pueden ingresar caracteres especiales'
        isValid.value = false
    }
    else if (emailValue.length < 6) {
        emailError.value = 'El correo no puede tener menos de 6 caracteres'
        isValid.value = false
    }
    else if (!regexEmail.test(emailValue)) {
        emailError.value = 'Solo puede ingresarse un email valido'
        isValid.value = false
        return
    }

    if (passValue === '') {
        passError.value = 'El campo del contraseña no puede quedar vacio'
        isValid.value = false
    }
    else if (!regexPass.test(passValue)) {
        passError.value = 'No pueden ingresarse caracteres especiales'
        isValid.value = false
    }
    else if (passValue.length < 6) {
        passError.value = 'La contraseña no puede tener menos de 6 caracteres'
        isValid.value = false
    }
}

const loginSesion = async () => {

    sanitizarCampos()
    validarCampos()

    if (!isValid.value) return

    try {

        const emailValue = email.value
        const passValue = pass.value

        const usuario = await auth.login(emailValue, passValue)
        
        if(!usuario) throw new Error('Login fallido')

        const rol = auth.rol

        if (rol === 'admin') {
            router.push('/dashboard/admin/inicio')
        } else {
            router.push('/dashboard/user/inicio')
        }

    } catch (error) {
        modal.value = {
            titulo: 'No se pudo iniciar sesión',
            desc: 'Credenciales inválidas',
            confirmar: true
        }
    }
}

const cerrarModal = () => {
    modal.value = null
}

const confirmarModal = () => {
    modal.value = null
}

onMounted(() => {
    ctx = gsap.context(() => {
        gsap.from('.main', {
            x: 20,
            duration: 1,
            opacity: 0
        })
    })
})

onUnmounted(() => {
    ctx?.revert()
})

const botones = [
    { tipo: 'link', url: '/', texto: 'Inicio' }
]
</script>

<template>
    <div class="min-h-screen flex flex-col overflow-x-hidden">

        <Navbar :botones="botones" />

        <main class="flex-1 flex items-center justify-center mt-30 mb-30 main">
            <div
                class="relative w-full max-w-[380px] bg-white/5 border border-purple-400/20 rounded-[20px] px-8 py-10 overflow-hidden backdrop-blur-xl flex flex-col">

                <div class="text-center">
                    <h1 class="text-white font-bold text-3xl mb-1">
                        Inicio de sesión
                    </h1>

                    <p class="text-purple-400 text-sm mb-8">
                        Accede a tu cuenta
                    </p>
                </div>
                <!-- Título -->


                <!-- Form -->
                <div class="flex flex-col gap-5">

                    <!-- Email -->
                    <div class="flex flex-col gap-1">
                        <label class="text-purple-400 text-sm">
                            Correo electrónico
                        </label>

                        <input v-model="email" type="text"
                            class="bg-white/90 border border-purple-500 rounded-lg w-full h-10 px-3 text-sm"
                            placeholder="Ingresa tu correo electrónico" />

                        <p class="text-red-400 text-sm min-h-[20px]">{{ emailError }}</p>
                    </div>

                    <!-- Password -->
                    <div class="flex flex-col gap-1">
                        <label class="text-purple-400 text-sm">
                            Contraseña
                        </label>

                        <input v-model="pass" type="password"
                            class="bg-white/90 border border-purple-500 rounded-lg w-full h-10 px-3 text-sm"
                            placeholder="Ingresa tu contraseña" />

                        <p class="text-red-400 text-sm min-h-[20px]">{{ passError }}</p>
                    </div>

                    <!-- Button -->
                    <button
                        class="mt-2 bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white rounded-lg py-2.5 w-full font-bold hover:scale-105 transition duration-150"
                        @click="loginSesion">
                        Acceder
                    </button>

                </div>

            </div>
        </main>

        <Footer />

        <Modal v-if="modal" :modal="modal" @close="cerrarModal" @confirm="confirmarModal" />
    </div>
</template>

<!--El root css tiene  background: linear-gradient(to right,#1a0047, #0d0022);-->