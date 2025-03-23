import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import ShelterDashboardPage from '@/pages/ShelterDashboardPage.vue';
import RequestResetPasswordPage from '@/pages/RequestResetPasswordPage.vue';
import ResetPasswordPage from '@/pages/ResetPasswordPage.vue';
import ContactUsPage from '@/pages/ContactUsPage.vue';
import AboutUsPage from '@/pages/AboutUsPage.vue';
import ManagePets from '@/components/ManagePets.vue';
import PetStatsChartVue from '@/components/PetStatsChart.vue';
import EditShelterProfileVue from '@/pages/EditShelterProfile.vue';
import AvailablePetsPage from '@/pages/AvailablePetsPage.vue';
import ShelterProfilePage from '@/pages/ShelterProfilePage.vue';
import ShelterProfileCompletionPage from '@/pages/ShelterProfileCompletionPage.vue';

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
      path: '/request-reset-password',
      name: 'RequestResetPasswordPage',
      component: RequestResetPasswordPage, 
    },
    {
      path: '/reset-password',
      name: 'ResetPasswordPage',
      component: ResetPasswordPage, 
    },
    {
      path: '/shelter-profile-completion',
      name: 'ShelterProfileCompletionPage',
      component: ShelterProfileCompletionPage, 
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage, 
      meta: { requiresAuth: true },
    },
    {
      path: '/available-pets',
      name: 'AvailablePetsPage',
      component: AvailablePetsPage, 
      // meta: { requiresAuth: true },
    },
    {
      path: '/shelter/:username',
      name: 'ShelterProfilePage',
      component: ShelterProfilePage, 
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
          path: 'edit-profile',
          component: EditShelterProfileVue
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
    {
      path: '/about-us',
      name: 'AboutUsPage',
      component: AboutUsPage, 
      // meta: { requiresAuth: true },
    },
  ],
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 
  const isAuthenticated = !!token; 
  const isFirstLogin = localStorage.getItem("firstLogin") === "true";
  const isShelter = localStorage.getItem("Role") === "SHELTER";

  if (
    (from.path === '/login' || from.path === '/signup') && 
    to.path === '/' && 
    from.path !== to.path 
  ) {
    next(); 
    return;
  }

  // daca ajung la landing page sa nu mai pot da back din browser
  if (to.path === '/') {
    window.history.replaceState(null, null, '/');
  }

  // Verifică dacă este prima autentificare a unui adăpost și încearcă să navigheze în altă parte
  if (isAuthenticated && isFirstLogin && isShelter && to.path !== '/shelter-profile-completion') {
    next('/shelter-profile-completion');
    return;
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
