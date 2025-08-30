import '@/assets/style/main.css';

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import '@/api/interceptor'
import pinia from './store/index'

import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(TDesign)

app.mount('#app')
