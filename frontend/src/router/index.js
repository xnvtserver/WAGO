import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

import LoginView from '@/views/auth/LoginPage.vue';
import RegisterView from '@/views/auth/RegisterPage.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import studentView from '@/student/studentDashboard/DashboardView.vue';
import UserDashboard from '@/views/dashboard/UserDashboard.vue';
import EmployeeDashboard from '@/views/dashboard/EmployeeDashboard.vue';
import AdminDashboard from '@/views/dashboard/AdminDashboard.vue';

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
    meta: { requiresAuth: true, title: 'Dashboard' },
    redirect: () => {
      const authStore = useAuthStore();
      const role = authStore.user?.role;

      if (role === 'customer') return '/dashboard/user';
      if (role === 'employee' || role === 'staff') return '/dashboard/employee';
      if (role === 'admin') return '/dashboard/admin';
      if (role === 'owner') return '/dashboard/admin';
      return '/login';
    }
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
    meta: { requiresAuth: true, title: 'Student Dashboard' }
  },
  {
    path: '/dashboard/user',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, title: 'User Dashboard' }
  },
  {
    path: '/dashboard/employee',
    name: 'EmployeeDashboard',
    component: EmployeeDashboard,
    meta: { requiresAuth: true, title: 'Employee Dashboard' }
  },
  {
    path: '/dashboard/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, title: 'Admin Dashboard' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔥 Global Router Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.initialize(); // restore state from storage

  const isAuthenticated = authStore.isAuthenticated;
  const role = authStore.user?.role;

  try {
    // Auth required
    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        return next('/login');
      }

      const isValid = await authStore.validateToken();
      if (!isValid) {
        authStore.clearAuth();
        return next('/login');
      }
    }

    // Guest-only routes
    if (to.meta.requiresGuest && isAuthenticated) {
      if (role === 'customer') return next('/dashboard/user');
      if (role === 'employee' || role === 'staff') return next('/dashboard/employee');
      if (role === 'admin') return next('/dashboard/admin');
      return next('/dashboard'); // fallback
    }

    return next();
  } catch (error) {
    console.error('Router Guard Error:', error);
    authStore.clearAuth();
    return next('/login');
  }
});

export default router;
