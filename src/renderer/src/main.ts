import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'atropos/css';

import App from './App.vue';
import router from './routes/router';
import './assets/css/styles.css';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('#app');
