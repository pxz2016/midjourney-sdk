import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import "virtual:svg-icons-register";

const pinia = createPinia()

const app = createApp(App)
app.use(pinia).mount('#app')
