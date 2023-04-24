import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueFire, VueFireAuth } from 'vuefire';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import BadgeDirective from 'primevue/badgedirective';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'atropos/css';

import './assets/css/styles.css';

import 'primevue/resources/themes/viva-dark/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/solid.css';

import './firebase/index';

import App from './App.vue';
import router from './routes/router';
import { firebaseApp } from './firebase/index';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(PrimeVue);
app.use(ToastService);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.directive('badge', BadgeDirective);

app.mount('#app');
