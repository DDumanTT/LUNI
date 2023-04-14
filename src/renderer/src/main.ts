import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'atropos/css';

import 'primevue/resources/themes/viva-dark/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './routes/router';
import './assets/css/styles.css';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(PrimeVue);
app.mount('#app');
