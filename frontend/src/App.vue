<template>
  <div id="app-container">
<nav v-if="isAuthenticated && shouldShowUnauthenticatedNav" class="unauth-nav bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <i class="fas fa-store text-indigo-600 text-2xl mr-2" aria-hidden="true"></i>
              <span class="text-xl font-bold text-gray-900">കട രജിസ്ട്രേഷൻ</span>
            </div>
          </div>

          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <router-link
              to="/login"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
              active-class="text-indigo-600 font-semibold"
            >
              ലോഗിൻ
            </router-link>
            <router-link
              to="/register"
              class="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              active-class="bg-indigo-700"
            >
              രജിസ്റ്റർ ചെയ്യുക
            </router-link>
          </div>
          </div>
      </div>
      </nav>

    <AuthenticatedNavigation v-if="isAuthenticated" />

    <main :class="['main-content flex-grow', { 'unauthenticated-view-padding': !isAuthenticated && shouldShowUnauthenticatedNav }]">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition name="fade" mode="out-in">
          <div :key="currentRoute.path" class="router-view-wrapper">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>

    <footer v-if="showFooter" class="app-footer bg-gray-100 text-gray-600 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm">&copy; {{ new Date().getFullYear() }} xnovity softwares pvt ltd - All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthenticatedNavigation from './components/dashboard/AuthenticatedNavigation.vue' // Verify path

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => {
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
    return !!localStorage.getItem('authToken')
  }
  return false
})

// You might not want to show the unauthenticated nav on every unauthenticated page
// For example, a dedicated full-screen "Forgot Password" page might not need it.
const shouldShowUnauthenticatedNav = computed(() => {
  // Example: list of routes where the unauthenticated nav should NOT be shown
  const routesWithoutNav = ['ForgotPassword', 'EmailVerification']; // Add route names
  return !isAuthenticated.value && (route.name ? !routesWithoutNav.includes(route.name) : true);
});

const showFooter = computed(() => {
  // Hide footer on dashboard or other specific authenticated routes if needed
  if (isAuthenticated.value) {
    return route.name !== 'Dashboard'; // Example: Hide on Dashboard
  }
  // Show footer on all unauthenticated pages, or add specific logic
  return true;
})

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Watch for route changes to close the mobile menu
watch(() => route.path, () => {
  closeMobileMenu()
})

// The handleLogout function is usually part of AuthenticatedNavigation
// or a user profile dropdown. If you need it here, it would be:
// const handleLogout = () => {
//   localStorage.removeItem('authToken');
//   // Optionally, notify other parts of the app or redirect
//   router.push('/login').then(() => {
//     // Force re-evaluation of computed properties if necessary,
//     // though Vue's reactivity usually handles this.
//     // Forcing a reload can be a blunt instrument: window.location.reload();
//   });
// };
</script>

<style>
/* Ensure Font Awesome is properly linked if you use `fas fa-store` */
/* @import '@fortawesome/fontawesome-free/css/all.min.css'; */

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;700&display=swap');

body {
  font-family: 'Noto Sans Malayalam', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Added fallbacks */
  background-color: #f8fafc; /* Tailwind's gray-50 */
  margin: 0;
  color: #374151; /* Tailwind's gray-700 for better default contrast */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app-container { /* Renamed from #app to avoid potential conflicts if #app is used by Vue globally */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Sticky nav behavior is on the nav elements themselves with Tailwind classes */

.main-content {
  flex-grow: 1; /* Essential for sticky footer */
  padding: 1.5rem; /* Default padding for main content area */
}

/* Add top padding to main content if the unauthenticated nav is present and sticky */
.unauthenticated-view-padding {
  /* The h-16 class on nav means height: 4rem. Adjust if nav height changes. */
  /* padding-top: calc(4rem + 1.5rem); /* Nav height + desired space */
}


/* Styles for views like Login, Register when user is not authenticated */
/* You'd apply 'auth-view-container' to the root div of your Login.vue, Register.vue, etc. */
/*
  Example in Login.vue:
  <template>
    <div class="auth-view-container">
      <h2>Login</h2>
      ...
    </div>
  </template>
*/
.auth-view-container {
  max-width: 420px; /* Max width for login/register forms */
  margin: 2rem auto; /* Centering and top/bottom margin */
  padding: 2rem;    /* Padding inside the auth form container */
  background-color: #ffffff;
  border-radius: 0.5rem; /* 8px */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer shadow */
}

/* For responsive design of the auth-container itself */
@media (min-width: 640px) { /* sm breakpoint */
  .main-content {
    padding: 2rem;
  }
  .auth-view-container {
    padding: 2.5rem;
  }
}


/* Router Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Ensure the wrapper takes up space during transition */
.router-view-wrapper {
  position: relative;
}


/* Common button style (primary action) */
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out;
}

/* Input field base style */
.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
}

/* Active Tab style for navigation or tab-like elements */
.tab-active {
  @apply border-indigo-500 text-indigo-600; /* Ensure this matches active-class for router-links if used for tabs */
}

.app-footer {
  margin-top: auto; /* Pushes footer to the bottom */
  width: 100%; /* Ensure footer takes full width */
}

/* Mobile Menu Specifics */
.mobile-menu-panel a { /* Style links in mobile dropdown */
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
</style>