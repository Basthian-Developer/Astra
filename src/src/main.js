import { createApp } from 'vue'
import './style.css'
import router from './router'
import Inicio from './layouts/Inicio.vue'

createApp(Inicio).use(router).mount('#app')
