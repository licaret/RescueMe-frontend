import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import ShelterDashboardPage from '@/pages/ShelterDashboardPage.vue';

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
    },
  ],
});

router.beforeEach((to, from, next) => {

  const isAuthenticated = !!localStorage.getItem('token'); 

  // console.log('From:', from.path, 'To:', to.path);

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
