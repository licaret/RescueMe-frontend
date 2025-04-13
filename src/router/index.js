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
import ManageEvents from '@/components/ManageEvents.vue';
import ShelterAdoptionRequests from '@/components/ShelterAdoptionRequests.vue';
import EditShelterProfileVue from '@/pages/EditShelterProfile.vue';
import AvailablePetsPage from '@/pages/AvailablePetsPage.vue';
import ShelterProfilePage from '@/pages/ShelterProfilePage.vue';
import ShelterProfileCompletionPage from '@/pages/ShelterProfileCompletionPage.vue';
import WelcomePage from '@/pages/WelcomePage.vue';
import AdminDashboardPage from '@/pages/AdminDashboardPage.vue';
import FavoritesPage from '@/pages/FavoritesPage.vue';
import AdoptionRequestDetail from '@/components/AdoptionRequestDetail.vue';
import AdoptionRequestForm from '@/components/AdoptionRequestForm.vue';
import AdoptionRequestsView from '@/pages/AdoptionRequestsView.vue';
import MyProfilePage from '@/pages/MyProfilePage.vue';
import EventsPage from '@/pages/EventsPage.vue';

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
      meta: { requiresAuth: true }, 
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage, 
      // meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'FavoritesPage',
      component: FavoritesPage, 
      meta: { requiresAuth: true },
    },
    {
      path: '/available-pets',
      name: 'AvailablePetsPage',
      component: AvailablePetsPage, 
      // meta: { requiresAuth: true },
    },
    {
      path: '/events',
      name: 'EventsPage',
      component: EventsPage, 
      // meta: { requiresAuth: true },
    },
    {
      path: '/shelter/:id',
      name: 'ShelterProfilePage',
      component: ShelterProfilePage, 
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'MyProfile',
      component: MyProfilePage, 
      meta: { requiresAuth: true },
    },
    {
      path: '/shelter-dashboard/',
      name: 'ShelterDashboardPage',
      component: ShelterDashboardPage, 
      meta: { requiresAuth: true },
      children: [
        {
          path: 'manage-pets',
          name: 'ManagePets',
          component: ManagePets
        },
        {
          path: 'adoption-requests',
          name: 'ShelterAdoptionRequests',
          component: ShelterAdoptionRequests,
          props: route => ({ 
            shelterId: parseInt(localStorage.getItem('Id')) 
          })
        },
        {
          path: 'manage-events',
          name: 'ManageEvents',
          component: ManageEvents
        },
        {
          path: 'edit-profile',
          name: 'EditShelterProfileVue',
          component: EditShelterProfileVue
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
    {
      path: '/admin-dashboard',
      name: 'AdminDashboardPage',
      component: AdminDashboardPage, 
      meta: { requiresAuth: true },
    },
    {
      path: '/welcome',
      name: 'WelcomePage',
      component: WelcomePage, 
      meta: { requiresAuth: true },
    },
    {
      path: '/adopt/:petId',
      name: 'AdoptionForm',
      meta: { requiresAuth: true }, 
      component: AdoptionRequestForm,
      props: route => {
        return {
          petId: route.params.petId,
          pet: route.params.pet || null
        };
      },
      // Guard to check if user is logged in and is an ADOPTER
      beforeEnter: (to, from, next) => {
        const userId = localStorage.getItem('Id');
        const userRole = localStorage.getItem('Role');
        
        if (!userId) {
          // Redirect to login
          next({
            path: '/login',
            query: { redirect: 'adoption', petId: to.params.petId }
          });
        } else if (userRole !== 'ADOPTER') {
          // Only adopters can submit adoption requests
          alert('Only adopters can submit adoption requests.');
          next(from);
        } else {
          next();
        }
      }
    },
    {
      path: '/adoption-requests',
      name: 'AdoptionRequests',
      meta: { requiresAuth: true }, 
      component: AdoptionRequestsView,
      // Guard to ensure user is logged in
      beforeEnter: (to, from, next) => {
        const userId = localStorage.getItem('Id');
        
        if (!userId) {
          next({ path: '/login' });
        } else {
          next();
        }
      }
    },
    {
      path: '/adoption-requests/:id',
      name: 'AdoptionRequestDetail',
      meta: { requiresAuth: true }, 
      component: AdoptionRequestDetail,
      // Guard to ensure user is logged in
      beforeEnter: (to, from, next) => {
        const userId = localStorage.getItem('Id');
        
        if (!userId) {
          next({ path: '/login' });
        } else {
          next();
        }
      }
    }
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
