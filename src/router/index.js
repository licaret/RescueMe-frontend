import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage, 
    },
    {
      path: '/signup',
      name: 'SignUpPage',
      component: SignUpPage, 
    },
  ],
});

export default router;
