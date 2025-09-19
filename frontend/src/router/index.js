//front-end/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import LoginView from '@/views/auth/LoginPage.vue';
import RegisterView from '@/views/auth/RegisterPage.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import studentView from '@/student/studentDashboard/DashboardView.vue';
const routes = [
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore();
      return authStore.isAuthenticated ? '/dashboard' : '/login';
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, title: 'Login' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true, title: 'Register' }
  },
    {
    path: '/student',
    name: 'student',
    component: studentView,
    meta: { requiresAuth: true, title: 'student' }
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Router Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  try {
    if (!authStore.isInitialized) {
      await authStore.initialize();
    }
    if (to.meta.requiresAuth) {
      console.log('Route requires authentication.');
      if (!authStore.isAuthenticated) {
        console.log('Not authenticated, redirecting to /login');
        return next('/login');
      }
      const isValid = await authStore.validateToken();
      console.log('Token valid:', isValid);
      if (!isValid) {
        authStore.clearAuth();
        console.log('Token invalid, redirecting to /login.');
        return next('/login');
      }
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      console.log('Admin role required, but user is:', authStore.user?.role, 'redirecting to /dashboard');
      return next('/dashboard');
    }

    return next();
  } catch (error) {
    console.error('Router Guard Error:', error);
    authStore.clearAuth();
    return next('/login');
  }
});


export default router;
