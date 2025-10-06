<!-- front-end/src/views/aut/LoginPage.vue -->
<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Illustration Section -->
    <div class="lg:w-1/2 bg-white flex items-center justify-center p-8">
      <div class="max-w-md">
        <img src="/home/vivek/Desktop/Vivek/WORKSPACE/crs/frontend/src/assets/logo.png" alt="Login" class="w-full h-auto" />
        <h2 class="text-2xl font-bold text-gray-800 mt-6 text-center">നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പ്രവേശിക്കുക</h2>
        <p class="text-gray-600 mt-2 text-center">ഞങ്ങളുടെ സേവനങ്ങൾ ഉപയോഗിക്കാൻ സൈൻ ഇൻ ചെയ്യുക</p>
      </div>
    </div>

    <!-- Login Form Section -->
    <div class="lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <i class="fas fa-lock text-white text-xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 ml-3">സുരക്ഷിതം</h1>
          </div>

          <div class="flex space-x-2">
            <button class="language-selector bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              മലയാളം
            </button>
            <button class="language-selector bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              English
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Register -->
<div class="flex items-center text-sm text-gray-600">
  <a href="/register" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
    Register
  </a>
</div>
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">ലോഗിൻ</h2>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">ഇമെയിൽ വിലാസം</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  v-model="credentials.email"
                  required
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="നിങ്ങളുടെ ഇമെയിൽ നൽകുക"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">പാസ്വേഡ്</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="credentials.password"
                  required
                  class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="നിങ്ങളുടെ പാസ്വേഡ് നൽകുക"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center text-sm text-gray-600">
              <input type="checkbox" id="rememberMe" v-model="rememberMe" class="mr-2" />
              <label for="rememberMe">Remember me</label>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              {{ loading ? 'ലോഗിൻ ചെയ്യുന്നു...' : 'ലോഗിൻ' }}
            </button>

            <!-- Error -->
            <div v-if="errorMessage" class="text-red-500 text-sm text-center">
              {{ errorMessage }}
            </div>
          </form>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthService from '@/services/auth';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const showPassword = ref(false);
    const loading = ref(false);
    const errorMessage = ref('');
    const rememberMe = ref(false);

    const credentials = reactive({
      email: '',
      password: ''
    });

    const handleLogin = async () => {
      try {
        loading.value = true;
        errorMessage.value = '';

        const { email, password } = credentials;
        const remember = rememberMe.value;

        const data = await AuthService.login(email, password, remember);
        console.log("Login Response Data:", data); // Debug: Check the entire response

        authStore.setAuth({
          token: data.token,
          user: data.user,
          shops: data.shops || [],
          permissions: data.permissions || [],
          remember
        });

        const redirectPath = route.query.redirect || '/dashboard';
        await router.push(redirectPath);
      } catch (error) {
        console.error('Login error:', error);
        errorMessage.value = error.response?.data?.message || error.message || 'Login failed.';
      } finally {
        loading.value = false;
      }
    };

    return {
      credentials,
      rememberMe,
      loading,
      errorMessage,
      showPassword,
      handleLogin
    };
  }
};
</script>



<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
}

.language-selector {
  transition: all 0.3s ease;
}
.language-selector:hover {
  transform: scale(1.05);
}
.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
