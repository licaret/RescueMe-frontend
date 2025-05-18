import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css';

import { setupAuthInterceptor } from './utils/auth_interceptor.js';

const app = createApp(App)

setupAuthInterceptor();

app.use(router)

app.mount('#app')
