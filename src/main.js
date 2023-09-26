

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css';

import started from "@/components/started.vue";

const app1=createApp(App)
app1.use(ElementPlus)
app1.mount('#app1')

// const app2=createApp(started)
// app2.mount('#app2')

