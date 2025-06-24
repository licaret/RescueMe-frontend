import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import ShelterDashboardPage from '@/pages/ShelterDashboardPage.vue';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.vue';
import ContactUsPage from '@/pages/ContactUsPage.vue';
import ManagePets from '@/components/ManagePets.vue';
import PetStatsChartVue from '@/components/PetStatsChart.vue';

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
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage, 
    },
    {
      path: '/forgot-password',
      name: 'ForgotPasswordPage',
      component: ForgotPasswordPage, 
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage, 
      // meta: { requiresAuth: true },
    },
    {
      path: '/shelter-dashboard',
      name: 'ShelterDashboardPage',
      component: ShelterDashboardPage, 
      meta: { requiresAuth: true },
      children: [
        {
          path: 'manage-pets',
          component: ManagePets
        },
        {
          path: '',
          component: PetStatsChartVue
        },
      ]
    },
    {
      path: '/contact',
      name: 'ContactUsPage',
      component: ContactUsPage, 
      // meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token'); 
  const isAuthenticated = !!token; 


  if (
    (from.path === '/login' || from.path === '/signup') && 
    to.path === '/' && 
    from.path !== to.path 
  ) {
    next(); 
    return;
  }


  // daca ajung la landing page sa nu mai potd a back din browser
  if (to.path === '/') {
    window.history.replaceState(null, null, '/');
  }


  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); 
  } else {
    next();
  }
});


window.addEventListener('popstate', () => {
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/signup') {
    router.push('/');
  }
});

export default router;
