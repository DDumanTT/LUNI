import { createMemoryHistory, createRouter } from 'vue-router';

import MainLayout from './MainLayout.vue';
import HomePage from './HomePage.vue';
import GamesPage from './GamesPage.vue';
import FriendsPage from './FriendsPage.vue';
import ErrorPage from './ErrorPage.vue';

export default createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      redirect: { path: '/home' },
      component: MainLayout,
      children: [
        { path: 'home', component: HomePage },
        { path: 'games', component: GamesPage },
        { path: 'friends', component: FriendsPage },
      ],
    },
    { path: '/:pathMatch(.*)*', component: ErrorPage },
  ],
});
