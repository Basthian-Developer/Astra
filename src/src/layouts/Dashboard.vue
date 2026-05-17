<script setup>
// Importaciones
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

// Componentes
import Footer from '../components/Footer.vue';

// Variables
const router = useRouter()

// Funciones
const logout = async () => {

    await signOut(auth)

    router.push('/login')

}

</script>

<template>
    <div class="min-h-screen overflow-x-hidden flex flex-col justify-center">
        <div class="flex-1 w-full">
            <main class="flex flex-col">
                Hola
                <button @click="logout" class="bg-red-500/90 rounded w-30 h-10 text-white font-bold hover:scale-105 transition duration-200">Cerrar Sesión</button>
            </main>
            <Footer/>
        </div>
    </div>
</template>