//front-end/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/auth/LoginPage.vue';
import RegisterView from '@/views/auth/RegisterPage.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import BillingView from '@/views/BillingView.vue';
import ProductPriceManagement from '@/components/product-pricing/ProductPriceManagement.vue';
import ProductAdd from '@/components/productCreation/ProductAdd.vue';
import Settings from '../views/settings/settings_page.vue';
import InventoryPage from '@/views/inventory/InventoryPage.vue';
// import ShopPermissions from '../components/shop/ShopPermissions.vue';
import ExcelUploadProductAdding from '../utils/ExcelUploadProductAdding.vue';
import SupplierManagement from '../views/supplier-management/SupplierManagement.vue';
import PurchaseManagement from '../views/purchase-management/PurchaseManagement.vue';
import createShop from '../views/shops/createNewShop.vue';

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
    meta: { requiresAuth: true, title: 'Dashboard - പച്ചക്കറി കട' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, title: 'Login - പച്ചക്കറി കട' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true, title: 'Register - പച്ചക്കറി കട' }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: BillingView,
    meta: { requiresAuth: true, title: 'Billing - പച്ചക്കറി കട' }
  },
{
  path: '/product-price',
  component: ProductPriceManagement,
  beforeEnter: (to, from, next) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      next('/login?redirect=' + encodeURIComponent(to.fullPath));
    } else if (!authStore.activeShop) { // Check activeShop
      next('/select-shop'); // Or handle missing shop
    } else {
      console.log('Route guard - Valid shop:', authStore.activeShop);
      next();
    }
  }
},
  {
    path: '/products/add',
    component: ProductAdd,
    meta: { requiresAuth: true, requiresSpecificPermission: 'create_product' },
        beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      console.log('[/products/add] beforeEnter - isAuthenticated:', authStore.isAuthenticated);
      console.log('[/products/add] beforeEnter - user:', authStore.user);
      if (!authStore.isAuthenticated || !authStore.user?.shop_id) {
        console.log('[/products/add] beforeEnter - Not authenticated or shop_id missing, redirecting to /login');
        next('/login?redirect=' + encodeURIComponent(to.fullPath));
      } else {
        console.log('[/products/add] beforeEnter - Valid shop_id:', authStore.user.shop_id);
        next();
      }
    }
  },

    {
    path: '/inventory',
    component: InventoryPage,
    meta: { requiresAuth: true, title: 'Inventory' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { title: 'Forgot Password - പച്ചക്കറി കട' }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  },
      {
      path: '/createShop',
    component: createShop,
        meta: { requiresAuth: true, title: 'Settings' }
  },
  //setings page route start
    {
      path: '/settings',
    component: Settings,
        meta: { requiresAuth: true, title: 'Settings' }
  },
  //shop-permissions page route end

    //shop-permissions page route start <router-link :to="`/shops/${shopId}/permissions`">Manage Permissions</router-link>

  //   {
  //     path: '/shop-permissions',
  //   component: ShopPermissions,
  //       meta: { requiresAuth: true, title: 'Settings' }
  // },
  //shop-permissions page route end
  
  //excel based product entry
    {
      path: '/ExcelUploadProductAdding',
    component: ExcelUploadProductAdding,
        meta: { requiresAuth: true, title: 'ExcelUploadProductAdding' }
  },
  // BulkProductUpload router.js
      {
      path: '/SupplierManagement',
    component: SupplierManagement,
        meta: { requiresAuth: true, title: 'SupplierManagement' }
  },
        {
      path: '/PurchaseManagement',
    component: PurchaseManagement,
        meta: { requiresAuth: true, title: 'PurchaseManagement' }
  },
  {
  path: '/sales/saleshistory/:shop_id',
  name: 'SalesHistory',
  component: () => import('@/views/sales/SalesHistory.vue')
},
  {
  path: '/shop-products/low-stock-products/shop_id',
  name: 'lowStockShopProducts',
  component: () => import('../components/Generic/Low-stock-shop-products-table.vue')
},
  {
  path: '/purchaseOrder',
  name: 'purchaseOrder',
  component: () => import('../purchase_orders/PurchaseOrder.vue')
},
{
  path: '/shops/:shopId/products/bulk-upload',
  name: 'bulk-product-upload',
  component: () => import('../BulkProductUpload/BulkProductUpload.vue'),
  meta: { requiresAuth: true, requiredPermissions: ['manage_inventory'] }
}

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
