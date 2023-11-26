import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueKonva from 'vue-konva';
import "@/assets/tailwind.css";


const app = createApp(App)

app.use(VueKonva)
app.use(createPinia())
app.use(router)

app.mount('#app')
