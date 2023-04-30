import { createMemoryHistory, createRouter } from 'vue-router';

import HomePage from './HomePage.vue';
import GamesPage from './GamesPage.vue';
import FriendsPage from './FriendsPage.vue';
import ErrorPage from './ErrorPage.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      redirect: { path: '/home' },
      children: [
        { path: 'home', component: HomePage },
        { path: 'games', component: GamesPage },
        { path: 'friends', component: FriendsPage },
      ],
    },
    { path: '/:pathMatch(.*)*', component: ErrorPage },
  ],
});

export default router;
